// PromptPay QR Code payload generation
// Based on EMV QR Code specification for Thailand PromptPay

function crc16(data: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  crc = crc & 0xFFFF;
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function formatLength(length: number): string {
  return length.toString().padStart(2, '0');
}

export function generatePromptPayPayload(promptpayId: string, amount: number): string {
  // Clean PromptPay ID (remove spaces and dashes)
  const cleanId = promptpayId.replace(/[\s-]/g, '');
  
  // Format amount to 2 decimal places
  const formattedAmount = amount.toFixed(2);
  
  // Build payload components
  const payloadVersion = '000201'; // Payload Format Indicator
  const pointOfInitiation = '010212'; // Point of Initiation Method (12 = QR)
  
  // Merchant Account Information (Tag 29)
  const merchantIdentifier = '0016A000000677010111'; // PromptPay identifier
  const merchantAccount = `01${formatLength(cleanId.length)}${cleanId}`;
  const merchantInfo = `29${formatLength(merchantIdentifier.length + merchantAccount.length)}${merchantIdentifier}${merchantAccount}`;
  
  const merchantCategory = '5802TH'; // Merchant Category Code + Country Code
  const transactionCurrency = '5303764'; // Thai Baht (764)
  const transactionAmount = `54${formatLength(formattedAmount.length)}${formattedAmount}`;
  
  // Build payload without CRC
  const payloadWithoutCRC = payloadVersion + pointOfInitiation + merchantInfo + merchantCategory + transactionCurrency + transactionAmount + '6304';
  
  // Calculate CRC
  const crcValue = crc16(payloadWithoutCRC);
  
  // Final payload
  return payloadWithoutCRC + crcValue;
}
