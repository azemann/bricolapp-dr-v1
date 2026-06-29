export const ValidationErrors = ({ messages }: { messages: string[] }) =>
  messages.length > 0 ? (
    <div className="warning">
      <p>Erreur(s) de validation :</p>
      <ul>
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </div>
  ) : null;
