export default function InstructionsContent() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Objective
        </h3>
        <p>
          Get as close to 21 as possible without going over, and beat the
          dealer&apos;s hand.
        </p>
      </section>

      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Card Values
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Number cards (2-10):</strong> Face value</li>
          <li><strong>Face cards (J, Q, K):</strong> 10 points each</li>
          <li><strong>Ace:</strong> 1 or 11 points (whichever is better)</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          How to Play
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>You and the dealer each receive 2 cards</li>
          <li>Your cards are face up, dealer has one face down</li>
          <li><strong>Hit:</strong> Get another card</li>
          <li><strong>Stand:</strong> Keep your hand and end your turn</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Winning
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Blackjack:</strong> Ace + 10-value card on first 2 cards</li>
          <li><strong>Win:</strong> Higher hand than dealer without busting</li>
          <li><strong>Push:</strong> Tie with dealer</li>
          <li><strong>Bust:</strong> Over 21 - you lose immediately</li>
        </ul>
      </section>

      <section>
        <h3 className="font-semibold text-black dark:text-white mb-2">
          Dealer Rules
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Dealer must hit on 16 or below</li>
          <li>Dealer must stand on 17 or above</li>
        </ul>
      </section>
    </div>
  );
}
