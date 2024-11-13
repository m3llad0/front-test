export default function formatPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber.startsWith('+')) {
    console.log(`Phone number must be E.164 format +52${phoneNumber}`)
    return `+52${phoneNumber}`;
  }
  return phoneNumber;
}