import React, { useState } from 'react';
import { PASS_TIERS, type PassTier } from '../data/passes';
import { ResonanceRingSymbol } from '../components/ResonanceRingSymbol';

export const FinaleSequence: React.FC = () => {
  const [selectedTierId, setSelectedTierId] = useState<string>('vip');

  const activeTier: PassTier =
    PASS_TIERS.find((p) => p.id === selectedTierId) || PASS_TIERS[1];

  return (
    <section id="passes" aria-label="Passes Section" className="section-spacing" style={{ backgroundColor: 'var(--color-void)', borderBottom: '1px solid var(--color-graphite)' }}>
      <div className="container-12">
        {/* Section Headline */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)', color: 'var(--color-ion-blue)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '1rem' }}>
            FESTIVAL ACCESS
          </div>
          <h2 className="section-title">
            YOUR ENTRY INTO ECHOFORM.
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta)', color: 'var(--color-muted-silver)', textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: '1.5rem' }}>
            <span>18—19 SEP 2027</span>
            <span style={{ color: 'var(--color-dim-gray)' }}>//</span>
            <span style={{ color: 'var(--color-resonance-violet)' }}>BENGALURU, INDIA</span>
          </div>
        </div>

        {/* Physical Access Object (Dominant) + Compact Editorial Selector */}
        <div className="passes-master-grid">
          {/* Left: Dominant Iconic Physical Access Object */}
          <div className="resonance-access-artifact">
            {/* Top Pass Technical Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-dim-gray)', letterSpacing: '0.14em', textTransform: 'uppercase', borderBottom: '1px solid var(--color-graphite)', paddingBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ width: '7px', height: '7px', backgroundColor: 'var(--color-ion-blue)', borderRadius: '50%' }} />
                <span style={{ color: 'var(--color-ion-blue)', fontWeight: 700 }}>RESONANCE ACCESS OBJECT</span>
              </div>
              <span style={{ color: 'var(--color-muted-silver)' }}>EF-2027-{activeTier.id.toUpperCase()}-0918</span>
            </div>

            {/* Monumental Concentric Core Keyframe */}
            <div className="access-object-core">
              <div className="access-object-core-ring">
                <ResonanceRingSymbol size={110} glow />
              </div>
              <div style={{ marginTop: '1.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-ion-blue)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                432.00 MHZ // SPATIAL FIELD NFC ENCRYPTION
              </div>
            </div>

            {/* Pass Physical Specifications Readout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', borderTop: '1px solid var(--color-graphite)', paddingTop: '1.5rem' }}>
              <div>
                <div style={{ color: 'var(--color-dim-gray)', fontSize: '0.75rem', textTransform: 'uppercase' }}>ACCESSED TIER:</div>
                <div style={{ color: 'var(--color-lunar-white)', fontWeight: 700, marginTop: '0.2rem' }}>{activeTier.name}</div>
              </div>
              <div>
                <div style={{ color: 'var(--color-dim-gray)', fontSize: '0.75rem', textTransform: 'uppercase' }}>MATERIAL SPEC:</div>
                <div style={{ color: 'var(--color-ion-blue)', marginTop: '0.2rem' }}>{activeTier.tokenType}</div>
              </div>
              <div>
                <div style={{ color: 'var(--color-dim-gray)', fontSize: '0.75rem', textTransform: 'uppercase' }}>VALIDITY:</div>
                <div style={{ color: 'var(--color-muted-silver)', marginTop: '0.2rem' }}>18—19 SEP 2027 // 2 NIGHTS</div>
              </div>
              <div>
                <div style={{ color: 'var(--color-dim-gray)', fontSize: '0.75rem', textTransform: 'uppercase' }}>INVESTMENT:</div>
                <div style={{ color: 'var(--color-lunar-white)', fontWeight: 800, fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginTop: '0.1rem' }}>{activeTier.price}</div>
              </div>
            </div>
          </div>

          {/* Right: Secondary Compact Editorial Ticket Selector */}
          <div className="pass-editorial-selector">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-resonance-violet)', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>
              SELECT FREQUENCY TIER
            </div>

            {PASS_TIERS.map((tier, idx) => {
              const isSelected = tier.id === selectedTierId;

              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTierId(tier.id)}
                  className={`pass-editorial-row ${isSelected ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: isSelected ? 'var(--color-resonance-violet)' : 'var(--color-dim-gray)', fontWeight: 700 }}>
                        0{idx + 1}
                      </span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', textTransform: 'uppercase', color: isSelected ? 'var(--color-lunar-white)' : 'var(--color-muted-silver)' }}>
                        {tier.name}
                      </span>
                    </div>

                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.35rem', color: isSelected ? 'var(--color-lunar-white)' : 'var(--color-muted-silver)' }}>
                      {tier.price}
                    </div>
                  </div>

                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--color-muted-silver)', lineHeight: 1.4, margin: 0 }}>
                    {tier.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--color-dim-gray)', borderTop: '1px solid rgba(23, 23, 27, 0.8)', paddingTop: '0.5rem' }}>
                    <span>{tier.badge}</span>
                    <span>•</span>
                    <span style={{ color: isSelected ? 'var(--color-ion-blue)' : 'inherit' }}>{tier.tokenType}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Checkout Bar */}
        <div className="pass-checkout-bar">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.35rem', color: 'var(--color-lunar-white)' }}>
              CONFIRM PASS // {activeTier.name} ({activeTier.price})
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-meta-xs)', color: 'var(--color-muted-silver)' }}>
              LIMITED PASSES PER RESONANCE CYCLE // 18—19 SEP 2027 BENGALURU
            </div>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={() => alert(`Frequency Pass Confirmed: ${activeTier.name} (${activeTier.price}). Ticket reservation initialized for Bengaluru 2027.`)}
          >
            CONFIRM PASS ↗
          </button>
        </div>
      </div>
    </section>
  );
};
