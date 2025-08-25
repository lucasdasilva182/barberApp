/**
 * Converte uma data ISO string (do banco) para o formato DD/MM/AAAA
 */
export const formatISODateToBR = (isoString: string | Date | null | undefined): string => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';

  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Converte uma data no formato DD/MM/AAAA para ISO string (para envio ao backend)
 * Ou retorna uma string no formato YYYY-MM-DD se preferir enviar só a data.
 */
export const parseBRDateToISO = (brDate: string): string | undefined => {
  if (!brDate) return undefined;
  const parts = brDate.split('/');
  if (parts.length !== 3) return undefined;

  const day = parts[0];
  const month = parts[1];
  const year = parts[2];

  const isoString = `${year}-${month}-${day}T00:00:00.000Z`;
  return isoString;
};
