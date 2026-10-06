import { useState } from "react";
import "./BukuTamu.css";

/*
  Buku Tamu Kos — formulir (nama tamu & No. HP) yang muncul setelah bel pintu dipencet.
  Tema: berdiri di depan pintu kos. Pencet bel, pintu terbuka, isi buku tamu.
*/

// Bunyi "ting!"
function ting() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 1318;
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  } catch {
    /* browser tidak mendukung audio, abaikan */
  }
}

export default function BukuTamu() {
  const [open, setOpen] = useState(false);
  const [ring, setRing] = useState(0);
  const [nama, setNama] = useState("");
  const [hp, setHp] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const pressBell = () => {
    ting();
    setRing((n) => n + 1);
    setOpen(!open);
  };

  const submit = () => {
    const digits = hp.replace(/[\s-]/g, "");
    if (!nama.trim()) return setError("Nama tamu belum diisi.");
    if (!/^\+?\d{9,14}$/.test(digits)) return setError("No. HP tidak valid.");
    setError("");
    setDone(true);
  };

  const isiLagi = () => {
    setDone(false);
    setNama("");
    setHp("");
  };

  return (
    <div className={`room ${open ? "open" : ""}`}>
      <div className="scene">
        <div className="doorcol">
          <div className="sign">Kos Melati No. 7</div>

          <div className="doorwrap">
            {/* Pintu */}
            <div className="frame">
              <div className="opening">
                <div className="inside" />
                <div className="door" aria-hidden="true">
                  <span className="knob" />
                </div>
              </div>
            </div>

            {/* Formulir keluar dari pintu */}
            <section className="book" aria-hidden={!open}>
              {done ? (
                <>
                  <h1>Terima kasih, {nama}.</h1>
                  <p className="welcome">
                    Kedatanganmu sudah dicatat. Silakan masuk, anggap rumah sendiri.
                  </p>
                  <button className="back" onClick={isiLagi}>Isi untuk tamu lain</button>
                </>
              ) : (
                <>
                  <h1>Buku Tamu Kos</h1>
                  <label className="field">
                    <span>Nama tamu</span>
                    <input
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      disabled={!open}
                      autoComplete="name"
                    />
                  </label>
                  <label className="field">
                    <span>No. HP</span>
                    <input
                      type="tel"
                      inputMode="tel"
                      value={hp}
                      onChange={(e) => setHp(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submit()}
                      disabled={!open}
                      autoComplete="tel"
                      placeholder="08xx xxxx xxxx"
                    />
                  </label>
                  <p className="err" role="alert">{error}</p>
                  <button type="button" className="go" onClick={submit} disabled={!open}>
                    Catat kedatangan
                  </button>
                </>
              )}
            </section>
          </div>
        </div>

        {/* Bel di samping pintu */}
        <div className="bellbox">
          <div className="plate">
            <button
              className="bell"
              onClick={pressBell}
              aria-pressed={open}
              aria-label={open ? "Pencet bel untuk menutup pintu" : "Pencet bel untuk membuka pintu"}
            >
              {ring > 0 && (
                <>
                  <span key={`a${ring}`} className="wave" />
                  <span key={`b${ring}`} className="wave w2" />
                </>
              )}
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.7 21a2 2 0 0 1-3.4 0" />
              </svg>
            </button>
            <span className="plate-label">TAMU</span>
          </div>
          <p className="hint">Pencet bel untuk membuka pintu</p>
        </div>
      </div>
    </div>
  );
}
