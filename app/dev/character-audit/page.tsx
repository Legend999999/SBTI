import { characterRegistry } from "../../../lib/characters";

const expectedCodes = [
  "CTRL",
  "ATM-er",
  "Dior-s",
  "BOSS",
  "THAN-K",
  "OH-NO",
  "GOGO",
  "SEXY",
  "LOVE-R",
  "MUM",
  "FAKE",
  "OJBK",
  "MALO",
  "JOKE-R",
  "WOC!",
  "THIN-K",
  "SHIT",
  "ZZZZ",
  "POOR",
  "MONK",
  "IMSB",
  "SOLO",
  "FUCK",
  "DEAD",
  "IMFW",
  "HHHH",
  "DRUNK",
];

export const metadata = {
  title: "Character Audit - MischiefType",
  robots: { index: false, follow: false },
};

export default function CharacterAuditPage() {
  const seen = new Map<string, string>();

  return (
    <main className="audit-page">
      <header>
        <p className="eyebrow">Internal development page</p>
        <h1>Character Audit</h1>
        <p>
          Checks every SBTI character against the central registry. The exact reference sheet was not attached in this task,
          so visual matching is based on the provided written correction and public SBTI reference imagery.
        </p>
      </header>
      <section className="audit-grid">
        {expectedCodes.map((code, index) => {
          const character = characterRegistry.find((item) => item.code === code);
          const duplicate = character ? seen.get(character.imageFull) : undefined;
          if (character && !duplicate) seen.set(character.imageFull, code);
          return (
            <article className="audit-card" key={code}>
              <div className="audit-meta">
                <b>{index + 1}</b>
                <span>Reference code: <bdi>{code}</bdi></span>
                <span>Displayed code: <bdi>{character?.code ?? "Missing"}</bdi></span>
                <span>Filename: {character?.imageFull ?? "Missing"}</span>
                <span>Dimensions: {character ? `${character.width}x${character.height}` : "Missing"}</span>
              </div>
              {!character && <strong className="warning">Missing-image warning</strong>}
              {duplicate && <strong className="warning">Duplicate-image warning: also used by {duplicate}</strong>}
              {character && (
                <div className="audit-images">
                  <figure>
                    <img src={character.imageFull} alt={character.alt.en} />
                    <figcaption>Full</figcaption>
                  </figure>
                  <figure>
                    <img src={character.imageCard} alt="" />
                    <figcaption>Card crop</figcaption>
                  </figure>
                  <figure>
                    <img src={character.imagePoster} alt="" />
                    <figcaption>Poster crop</figcaption>
                  </figure>
                  <figure>
                    <img src={character.imageThumbnail} alt="" />
                    <figcaption>Mobile crop</figcaption>
                  </figure>
                </div>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}
