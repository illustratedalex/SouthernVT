function parseCsvMatrix(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === ",") {
      row.push(field.trim());
      field = "";
      continue;
    }

    if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }

      row.push(field.trim());
      const isMeaningfulRow = row.some((value) => value.length > 0);
      if (isMeaningfulRow) {
        rows.push(row);
      }

      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  row.push(field.trim());
  if (row.some((value) => value.length > 0)) {
    rows.push(row);
  }

  return rows;
}

export function parseCsv(text: string): Array<Record<string, string>> {
  const matrix = parseCsvMatrix(text);
  if (matrix.length === 0) {
    return [];
  }

  const [headerRow, ...valueRows] = matrix;
  const headers = headerRow.map((header, index) => (header.trim() || `column_${index + 1}`));

  return valueRows.map((valueRow) => {
    const record: Record<string, string> = {};
    headers.forEach((header, headerIndex) => {
      record[header] = valueRow[headerIndex]?.trim() ?? "";
    });
    return record;
  });
}
