export default function Home() {
  return (
    <main className="root-redirect">
      <h1>MischiefType SBTI</h1>
      <p>Opening the English test...</p>
      <a href="/en">Continue to English</a>
      <script
        dangerouslySetInnerHTML={{
          __html:
            "var base=location.pathname.indexOf('/SBTI')===0?'/SBTI':'';location.replace(base+'/en');",
        }}
      />
    </main>
  );
}
