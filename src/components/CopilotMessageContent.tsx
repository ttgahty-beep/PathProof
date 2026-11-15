import React from 'react';

interface CopilotMessageContentProps {
  content: string;
  isUser?: boolean;
}

function renderInlineFormatting(text: string, isUser = false): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className={isUser ? 'font-bold text-white' : 'font-bold text-[#173629]'}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={idx}
          className={`px-1 py-0.5 rounded font-mono text-[11px] ${
            isUser ? 'bg-white/15 text-[#D8E99A]' : 'bg-[#F0EFE8] text-[#173629]'
          }`}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <em key={idx} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export const CopilotMessageContent: React.FC<CopilotMessageContentProps> = ({ content, isUser = false }) => {
  const lines = (content || '').split('\n');
  const blocks: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Markdown table block
    if (trimmed.startsWith('|') && i + 1 < lines.length && lines[i + 1].trim().startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      const parseCells = (row: string) =>
        row
          .replace(/^\|/, '')
          .replace(/\|$/, '')
          .split('|')
          .map((c) => c.trim());

      const headers = parseCells(tableLines[0]);
      const dataRows = tableLines
        .slice(1)
        .filter((r) => !/^\|[\s:-]+\|/.test(r))
        .map(parseCells);

      blocks.push(
        <div key={`tbl-${i}`} className="overflow-x-auto my-2 rounded-lg border border-[#E5E4DA]">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead className="bg-[#FAF9F5] border-b border-[#E5E4DA]">
              <tr>
                {headers.map((h, hIdx) => (
                  <th key={hIdx} className="px-2.5 py-1.5 font-bold text-[#173629]">
                    {renderInlineFormatting(h, isUser)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EFE8]">
              {dataRows.map((row, rIdx) => (
                <tr key={rIdx} className="bg-white">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-2.5 py-1.5 text-[#202A23]">
                      {renderInlineFormatting(cell, isUser)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Horizontal rule
    if (/^[-*_]{3,}$/.test(trimmed)) {
      blocks.push(<hr key={`hr-${i}`} className="my-2 border-[#E5E4DA]" />);
      i++;
      continue;
    }

    // Headings
    if (trimmed.startsWith('#### ')) {
      blocks.push(
        <h5
          key={`h4-${i}`}
          className={`font-bold text-xs pt-1 ${isUser ? 'text-white' : 'text-[#173629]'}`}
        >
          {renderInlineFormatting(trimmed.slice(5), isUser)}
        </h5>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith('### ')) {
      blocks.push(
        <h4
          key={`h3-${i}`}
          className={`font-bold text-[13px] pt-1 ${isUser ? 'text-white' : 'text-[#173629]'}`}
        >
          {renderInlineFormatting(trimmed.slice(4), isUser)}
        </h4>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      blocks.push(
        <h3
          key={`h2-${i}`}
          className={`font-bold text-sm pt-1 ${isUser ? 'text-white' : 'text-[#173629]'}`}
        >
          {renderInlineFormatting(trimmed.slice(3), isUser)}
        </h3>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith('# ')) {
      blocks.push(
        <h2
          key={`h1-${i}`}
          className={`font-bold text-[15px] pt-1 ${isUser ? 'text-white' : 'text-[#173629]'}`}
        >
          {renderInlineFormatting(trimmed.slice(2), isUser)}
        </h2>
      );
      i++;
      continue;
    }

    // Bullet list
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push(
        <ul key={`ul-${i}`} className="list-disc pl-4 space-y-1">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInlineFormatting(item, isUser)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s+/.test(trimmed)) {
      const firstMatch = trimmed.match(/^(\d+)\.\s+/);
      const startNum = firstMatch ? parseInt(firstMatch[1], 10) : 1;
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push(
        <ol key={`ol-${i}`} start={startNum} className="list-decimal pl-5 space-y-1">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInlineFormatting(item, isUser)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Regular paragraph
    blocks.push(
      <p key={`p-${i}`} className="leading-relaxed">
        {renderInlineFormatting(trimmed, isUser)}
      </p>
    );
    i++;
  }

  return <div className="space-y-1.5 font-sans">{blocks}</div>;
};
