import { SectionLabel } from './ui'

function Block({ block }) {
  if (block.type === 'text') {
    return <p className="text-[14px] text-neutral-600 leading-relaxed">{block.body}</p>
  }

  if (block.type === 'note') {
    return (
      <div className="rounded-xl border border-rdc-200 bg-rdc-50 px-4 py-3.5">
        <p className="text-[13px] text-rdc-800 leading-relaxed">{block.body}</p>
      </div>
    )
  }

  if (block.type === 'list') {
    return (
      <ul className="flex flex-col gap-3">
        {block.items.map((it, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-rdc-400 flex-shrink-0" />
            <p className="text-[14px] text-neutral-600 leading-relaxed">
              {typeof it === 'string' ? it : (
                <>
                  <span className="font-semibold text-neutral-900">{it.k}</span>
                  {' — '}{it.v}
                </>
              )}
            </p>
          </li>
        ))}
      </ul>
    )
  }

  if (block.type === 'timeline') {
    return (
      <div className="flex flex-col">
        {block.items.map((it, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center flex-shrink-0">
              <span className="h-2.5 w-2.5 rounded-full bg-rdc-600 mt-1.5" />
              {i < block.items.length - 1 && <span className="w-px flex-1 bg-rdc-200 my-1" />}
            </div>
            <div className={i < block.items.length - 1 ? 'pb-5' : ''}>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-rdc-600">
                {it.when}
              </p>
              <p className="font-display text-[16px] font-semibold text-neutral-900 leading-tight mt-1">
                {it.what}
              </p>
              <p className="text-[13px] text-neutral-500 leading-relaxed mt-1.5">{it.detail}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return null
}

export function Content({ doc }) {
  return (
    <div className="px-5 pb-16 pt-6 max-w-lg mx-auto">
      <h1 className="font-display text-[30px] leading-[1.1] font-bold uppercase tracking-tight text-neutral-900">
        {doc.title}
      </h1>
      <p className="text-[14px] text-neutral-500 leading-relaxed mt-3">{doc.blurb}</p>

      <div className="mt-9 flex flex-col gap-10">
        {doc.sections.map(sec => (
          <section key={sec.label}>
            <SectionLabel>{sec.label}</SectionLabel>
            <h2 className="font-display text-[20px] font-semibold text-neutral-900 leading-tight mb-4">
              {sec.heading}
            </h2>
            <div className="flex flex-col gap-4">
              {sec.blocks.map((b, i) => <Block key={i} block={b} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
