import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';

// EVM Wallet Regex
export const WALLET_REGEX = /0x[a-f0-9]{40}/gi;

/**
 * Detects value columns in a set of headers
 */
function findValueColumn(headers: string[]): number {
    const valueKeywords = ['value', 'staked', 'balance', 'amount', 'quantity', 'tokens', 'staked_value', 'usd', '/', 'eth', 'price', 'total'];
    const idx = headers.findIndex(h => valueKeywords.some(key => h.toLowerCase().includes(key)));
    if (idx !== -1) return idx;

    // Fallback: If 2 columns and one is NOT the wallet, it's likely the value
    const walletIdx = headers.findIndex(h => h.toLowerCase().includes('wallet') || h.toLowerCase().includes('address'));
    if (headers.length === 2 && walletIdx !== -1) {
        return walletIdx === 0 ? 1 : 0;
    }

    return -1;
}

/**
 * Normalizes and extracts valid EVM wallets and their associated values from a raw string or rows.
 */
export function extractPoolData(text: string, filename: string): {
    walletSet: Set<string>;
    walletArray: string[];
    walletValues: Record<string, string>;
    valueUnit?: string;
    validCount: number;
    duplicateCount: number;
} {
    const isStructured = filename.endsWith('.csv') || filename.endsWith('.xlsx') || filename.endsWith('.xls');
    const walletSet = new Set<string>();
    const walletArray: string[] = [];
    const walletValues: Record<string, string> = {};
    let valueUnit: string | undefined = undefined;
    let duplicateCount = 0;

    if (isStructured) {
        // Try to parse as CSV/Structured data
        const results = Papa.parse(text, { skipEmptyLines: true });
        const rows = results.data as string[][];

        if (rows.length > 0) {
            const headers = rows[0];
            const walletIdx = headers.findIndex(h => h.toLowerCase().includes('wallet') || h.toLowerCase().includes('address'));
            const valueIdx = findValueColumn(headers);

            if (valueIdx !== -1) {
                valueUnit = headers[valueIdx];
            }

            // If we found a wallet column, use row-based parsing
            if (walletIdx !== -1) {
                for (let i = 1; i < rows.length; i++) {
                    const row = rows[i];
                    const rawWallet = row[walletIdx];
                    if (!rawWallet) continue;

                    const matches = rawWallet.match(WALLET_REGEX);
                    if (matches) {
                        const wallet = matches[0].toLowerCase().trim();
                        const value = valueIdx !== -1 ? row[valueIdx]?.trim() || '0' : '0';

                        if (walletSet.has(wallet)) {
                            duplicateCount++;
                        } else {
                            walletSet.add(wallet);
                            walletArray.push(wallet);
                            walletValues[wallet] = value;
                        }
                    }
                }
                return { walletSet, walletArray, walletValues, valueUnit, validCount: walletSet.size, duplicateCount };
            }
        }
    }

    // Fallback: Regex-only extraction for PDFs, DOCX, or unstructured CSVs
    const matches = text.match(WALLET_REGEX) || [];
    matches.forEach(w => {
        const wallet = w.toLowerCase().trim();
        if (walletSet.has(wallet)) {
            duplicateCount++;
        } else {
            walletSet.add(wallet);
            walletArray.push(wallet);
            walletValues[wallet] = '0'; // No value context in unstructured text
        }
    });

    return {
        walletSet,
        walletArray,
        walletValues,
        valueUnit,
        validCount: walletSet.size,
        duplicateCount
    };
}

/**
 * File Parsers
 */

async function parseCSV(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            complete: (results) => {
                const text = results.data.map(row => (Array.isArray(row) ? row.join(',') : JSON.stringify(row))).join('\n');
                resolve(text);
            },
            error: (err) => reject(err),
            skipEmptyLines: true
        });
    });
}

async function parseXLS(file: File): Promise<string> {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    let fullText = '';
    workbook.SheetNames.forEach((name) => {
        const sheet = workbook.Sheets[name];
        const csv = XLSX.utils.sheet_to_csv(sheet);
        fullText += csv + '\n';
    });
    return fullText;
}

async function parseDOCX(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
}

async function parsePDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
        fullText += pageText + '\n';
    }
    return fullText;
}

export async function parseFile(file: File): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'csv': return await parseCSV(file);
        case 'xls':
        case 'xlsx': return await parseXLS(file);
        case 'pdf': return await parsePDF(file);
        case 'docx': return await parseDOCX(file);
        default: throw new Error(`Unsupported file type: ${extension}`);
    }
}
