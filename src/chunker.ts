export function chunkText(text: string, chunkSize: number = 200, overlap: number = 20): string[] {
    const words = text.split(" ")
    const chunks: string[] = []

    let i = 0
    while (i < words.length) {
        const chunk = words.slice(i, i + chunkSize).join(" ")
        chunks.push(chunk)
        i += chunkSize - overlap
    }
    return chunks
}