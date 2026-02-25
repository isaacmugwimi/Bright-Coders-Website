import { contactValidationSchema } from "../Middleware/Validators/contactValidator"
import * as Queries from "../Database/Config/contactQuries.js"

// 1. ADD NEW CONTACT (PUBLIC)
export const handleAddContact = async (request, response) => {
    try {
        const { error, value } = contactValidationSchema.validate(request.body, {
            abortEarly: false,
        })
        if (error) {
            const errorMessages = error.details.map((err) => err.message)
            return response
                .status(400)
                .json({ message: "Validation failed!", errors: errorMessages });
        }
        const newContact = await Queries.createContactMessage(value)
        return response.status(201).json(newContact);
    } catch (error) {
        return response.status(500).json({ message: "Error occurred" })
    }
}

// 2. GET ALL MESSAGES (ADMIN ONLY)
export const handleGetAllContacts = async (request, response) => {
    try {
        const messages = await Queries.getAllMessages();
        return response.status(200).json(messages);
    } catch (error) {
        console.error("Fetch Contacts Error:", error);
        return response.status(500).json({ message: "Could not retrieve messages" });
    }
}

// 3. UPDATE MESSAGE STATUS (ADMIN ONLY)
// Expects status in request body and ID in params: /api/contact/:id
export const handleUpdateContactStatus = async (request, response) => {
    try {
        const { id } = request.params;
        const { status } = request.body;

        // Optional: Simple validation for status types
        const validStatuses = ['unread', 'read', 'replied'];
        if (!validStatuses.includes(status)) {
            return response.status(400).json({ message: "Invalid status type" });
        }

        const updated = await Queries.updateMessageStatus(id, status);
        
        if (!updated) {
            return response.status(404).json({ message: "Message not found" });
        }

        return response.status(200).json(updated);
    } catch (error) {
        return response.status(500).json({ message: "Error updating status" });
    }
}

// 4. DELETE MESSAGE (ADMIN ONLY)
export const handleDeleteContact = async (request, response) => {
    try {
        const { id } = request.params;
        const deleted = await Queries.deleteContactMessage(id);

        if (!deleted) {
            return response.status(404).json({ message: "Message not found or already deleted" });
        }

        return response.status(200).json({ message: "Message deleted successfully", id: deleted.id });
    } catch (error) {
        return response.status(500).json({ message: "Error occurred during deletion" });
    }
}