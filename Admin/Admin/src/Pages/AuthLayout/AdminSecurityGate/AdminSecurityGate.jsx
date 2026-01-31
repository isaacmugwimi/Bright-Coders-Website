function AdminSecurityGate() {
  const [verified, setVerified] = useState(false);

  return verified
    ? <AdminSettings />
    : <OTPVerification onSuccess={() => setVerified(true)} />;
}
