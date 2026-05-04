import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <section className="hero">
        <div className="hero-eyebrow">Together with their families</div>
        <h1 className="hero-title">
          Victoria
          <br />
          <span className="script-word">and</span>
          <br />
          Christopher
        </h1>
        <div className="hero-divider"></div>
        <div className="hero-date">Thursday · August 27 · 2026</div>
        <div className="hero-location">Niagara Falls, Ontario</div>
      </section>

      <section className="details">
        <div className="detail">
          <div className="detail-label">Ceremony</div>
          <div className="detail-value">St Mary's Ukrainian Church</div>
          <div className="detail-sub">6248 Main St, Niagara Falls, ON</div>
          <div className="detail-sub">12:00 PM</div>
        </div>
        <div className="detail">
          <div className="detail-label">Reception</div>
          <div className="detail-value">Napoli Ristorante</div>
          <div className="detail-sub">5458 Ferry Street, Niagara Falls, ON</div>
          <div className="detail-sub">Cocktails at 4:00 PM | Dinner at 5:30 PM</div>
        </div>
      </section>
    </Layout>
  );
}
