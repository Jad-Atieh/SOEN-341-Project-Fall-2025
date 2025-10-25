import "../styles/style.css";

export default function CreateEvent() {
  const submit = (e) => {
    e.preventDefault();
    alert("Event saved (frontend demo). Backend integration comes next.");
  };

  return (
    <main className="page">
      <header className="page-header"><h1>Create Event</h1></header>

      <form className="form" onSubmit={submit}>
        <label>Title<input type="text" required placeholder="Event title" /></label>
        <label>Description<textarea required placeholder="Short description" /></label>
        <div className="row">
          <label>Date<input type="date" required /></label>
          <label>Time<input type="time" required /></label>
        </div>
        <label>Location<input type="text" required placeholder="Venue or Online" /></label>
        <label>Ticket Capacity<input type="number" min="1" required placeholder="Max seats" /></label>
        <button className="btn primary" type="submit">Save Event</button>
      </form>
    </main>
  );
}