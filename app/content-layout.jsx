export default function ContentLayout({ eyebrow = "SEA LEGENDS", children }) {
  return <main className="content-page">
    <div className="content-inner">
      <p className="content-eyebrow">{eyebrow}</p>
      {children}
    </div>
  </main>;
}
