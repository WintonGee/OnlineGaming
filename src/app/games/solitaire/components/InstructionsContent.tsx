export default function InstructionsContent() {
  return (
    <div className="space-y-4 text-gray-700 dark:text-gray-300">
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">Objective</h3>
        <p>
          Move all 52 cards to the four foundation piles, building each pile from Ace to King in the same suit.
        </p>
      </section>

      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">Layout</h3>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Tableau:</strong> Seven columns of cards. Build down in alternating colors (red-black).</li>
          <li><strong>Foundation:</strong> Four piles (top right). Build up by suit from Ace to King.</li>
          <li><strong>Stock:</strong> Draw pile (top left). Click to draw cards.</li>
          <li><strong>Waste:</strong> Cards drawn from stock. Only the top card can be played.</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">How to Play</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Click a card to select it, then click a destination to move.</li>
          <li>Double-click a card to auto-move it to a foundation if possible.</li>
          <li>Move sequences of face-up cards between tableau columns.</li>
          <li>Only Kings can be placed on empty tableau columns.</li>
          <li>Only Aces can start foundation piles.</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">Draw Modes</h3>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Draw 1:</strong> Draw one card at a time (easier).</li>
          <li><strong>Draw 3:</strong> Draw three cards at a time (traditional).</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">Keyboard Shortcuts</h3>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>D:</strong> Draw from stock</li>
          <li><strong>A:</strong> Auto-complete (when available)</li>
          <li><strong>N:</strong> New game</li>
          <li><strong>Esc:</strong> Clear selection</li>
          <li><strong>?:</strong> Show this help</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">Tips</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Always move Aces and Twos to foundations immediately.</li>
          <li>Uncover face-down cards as a priority.</li>
          <li>Empty columns are valuable - save them for Kings.</li>
          <li>When stock is empty, click it to recycle the waste pile.</li>
        </ul>
      </section>
    </div>
  );
}
