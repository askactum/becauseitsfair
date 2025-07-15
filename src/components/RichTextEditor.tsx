import './RichTextEditor.css';

export default function RichTextEditor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  return (
    <textarea
      className="simple-textarea"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Content"
      style={{
        minHeight: 220,
        background: '#222',
        color: '#fff',
        borderRadius: 8,
        border: '1.5px solid #444',
        padding: '1rem',
        fontSize: 16,
        width: '100%',
        resize: 'vertical',
        marginBottom: 8,
      }}
    />
  );
} 