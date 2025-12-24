import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onHit: () => void;
  onStand: () => void;
  disabled?: boolean;
}

export default function ActionButtons({ onHit, onStand, disabled }: ActionButtonsProps) {
  return (
    <div className="flex justify-center gap-3">
      <Button
        onClick={onHit}
        disabled={disabled}
        className="rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-wide"
      >
        Hit
      </Button>
      <Button
        onClick={onStand}
        disabled={disabled}
        variant="outline"
        className="rounded-full px-6 py-2 text-sm font-semibold uppercase tracking-wide"
      >
        Stand
      </Button>
    </div>
  );
}
