// Gera código PIX copia e cola no padrão EMV

function crc16(payload) {
  const polynomial = 0x1021;
  let crc = 0xFFFF;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc <<= 1;
      }
    }
  }

  crc &= 0xFFFF;
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function createEMVField(id, value) {
  const length = value.length.toString().padStart(2, '0');
  return `${id}${length}${value}`;
}

export function generatePixCode(cnpj, valor, nomeRecebedor = 'ErmoKids', cidadeRecebedor = 'Sao Paulo') {
  // Payload Format Indicator
  let payload = createEMVField('00', '01');

  // Merchant Account Information
  const gui = createEMVField('00', 'BR.GOV.BCB.PIX');
  const chave = createEMVField('01', cnpj);
  const merchantAccount = createEMVField('26', gui + chave);
  payload += merchantAccount;

  // Merchant Category Code
  payload += createEMVField('52', '0000');

  // Transaction Currency (BRL = 986)
  payload += createEMVField('53', '986');

  // Transaction Amount
  if (valor && valor > 0) {
    payload += createEMVField('54', valor.toFixed(2));
  }

  // Country Code
  payload += createEMVField('58', 'BR');

  // Merchant Name
  payload += createEMVField('59', nomeRecebedor);

  // Merchant City
  payload += createEMVField('60', cidadeRecebedor);

  // Additional Data Field Template
  payload += createEMVField('62', createEMVField('05', '***'));

  // CRC16
  payload += '6304';
  const checksum = crc16(payload);
  payload += checksum;

  return payload;
}