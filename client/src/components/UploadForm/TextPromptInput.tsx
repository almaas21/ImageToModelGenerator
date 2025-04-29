import { Textarea } from "@/components/ui/textarea";

interface TextPromptInputProps {
  textPrompt: string;
  setTextPrompt: (text: string) => void;
}

export default function TextPromptInput({ 
  textPrompt, 
  setTextPrompt 
}: TextPromptInputProps) {
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextPrompt(e.target.value);
  };
  
  return (
    <div className="space-y-4">
      <Textarea 
        placeholder="Describe what you want to create... 
Example: A red sports car with sleek design"
        value={textPrompt}
        onChange={handlePromptChange}
        className="h-40 resize-none"
      />
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Example prompts:</h3>
        <div className="grid grid-cols-1 gap-2">
          {EXAMPLE_PROMPTS.map((prompt, index) => (
            <button
              key={index}
              className="text-left px-3 py-2 rounded-md bg-muted hover:bg-muted/80 text-sm transition-colors"
              onClick={() => setTextPrompt(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const EXAMPLE_PROMPTS = [
  "A futuristic spaceship with glowing thrusters",
  "A cute cartoon elephant with big ears",
  "A modern minimalist armchair",
  "A fantasy castle on a floating island",
  "A sleek sports car with aerodynamic design"
];
