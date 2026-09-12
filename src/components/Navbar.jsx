import { useEffect, useRef, useState } from 'react'
import { useStoryContext } from '../context/StoryContext.js'
import { navLinks, scenes } from '../data/scenes.js'
import { store } from '../data/store.js'
import Logo from './Logo.jsx'
import '../styles/navbar.css'

export default function Navbar() {
  const { active, linkTo, goTo } = useStoryContext()
  const [open, setOpen] = useState(false)
  const burgerRef = useRef(null)
  const menuRef = useRef(null)
  const current = scenes[active]

  useEffect(() => {
    if (!open) return
    menuRef.current?.querySelector('a')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        burgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.classList.add('menu-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('menu-open')
    }
  }, [open])

  const goFromMenu = (id) => (e) => {
    e.preventDefault()
    setOpen(false)
    // Espera o menu fechar antes de percorrer a narrativa.
    setTimeout(() => goTo(id), 350)
  }

  return (
    <>
      <header className="nav" data-theme={open ? 'dark' : current.theme} data-top={active === 0 && !open}>
        <a className="nav__logo" href="#inicio" onClick={linkTo('inicio')}>
          <Logo />
          <span className="sr-only">{store.brand} {store.unit}, voltar ao início</span>
        </a>

        <nav className="nav__links" aria-label="Principal">
          <ul>
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="link-underline"
                  aria-current={current.id === link.id ? 'true' : undefined}
                  onClick={linkTo(link.id)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a className="btn btn--small nav__order" href={store.links.order} target="_blank" rel="noopener noreferrer">
          <span className="btn__label">Pedir no iFood</span>
        </a>

        <button
          ref={burgerRef}
          type="button"
          className="nav__burger"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? 'Fechar menu' : 'Abrir menu'}</span>
          <span className="nav__burger-line" aria-hidden="true" />
          <span className="nav__burger-line" aria-hidden="true" />
        </button>
      </header>

      <div id="menu-mobile" ref={menuRef} className="mmenu" data-open={open} inert={!open}>
        <nav aria-label="Menu">
          <ul className="mmenu__list">
            {navLinks.map((link, i) => (
              <li key={link.id} style={{ '--i': i }}>
                <a href={`#${link.id}`} className="mmenu__link" onClick={goFromMenu(link.id)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mmenu__footer" style={{ '--i': navLinks.length }}>
          <a className="btn btn--big" href={store.links.order} target="_blank" rel="noopener noreferrer">
            <span className="btn__label">Pedir no iFood</span>
          </a>
          <p>
            {store.address.street}, {store.address.city}
          </p>
        </div>
      </div>
    </>
  )
}
