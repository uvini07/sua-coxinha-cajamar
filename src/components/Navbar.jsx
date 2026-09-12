import { useEffect, useRef, useState } from 'react'
import { useStoryContext } from '../context/StoryContext.js'
import { navLinks } from '../data/scenes.js'
import { store } from '../data/store.js'
import Logo from './Logo.jsx'
import '../styles/navbar.css'

export default function Navbar() {
  const { current, linkTo, goTo } = useStoryContext()
  const [open, setOpen] = useState(false)
  const burgerRef = useRef(null)
  const menuRef = useRef(null)

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
    // Espera o menu fechar antes de rolar.
    setTimeout(() => goTo(id), 300)
  }

  const isActive = (id) => current.id === id || (id === 'cardapio' && current.id?.startsWith('cat-'))

  return (
    <>
      <header className="nav" data-theme={open ? 'dark' : current.theme} data-top={current.id === 'inicio' && !open}>
        <a className="nav__logo" href="#inicio" onClick={linkTo('inicio')}>
          <Logo />
          <span className="sr-only">
            {store.brand} {store.unit}, voltar ao início
          </span>
        </a>

        <nav className="nav__links" aria-label="Principal">
          <ul>
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="link-underline"
                  aria-current={isActive(link.id) ? 'true' : undefined}
                  onClick={linkTo(link.id)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a className="btn btn--small nav__order" href="#pedido" onClick={linkTo('pedido')}>
          <span className="btn__label">Fazer pedido</span>
        </a>

        <button
          ref={burgerRef}
          type="button"
          className="nav__burger"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav__burger-text">{open ? 'Fechar' : 'Menu'}</span>
          <span className="nav__burger-icon" aria-hidden="true">
            <span className="nav__burger-line" />
            <span className="nav__burger-line" />
          </span>
        </button>
      </header>

      <div id="menu-mobile" ref={menuRef} className="mmenu" data-open={open} inert={!open}>
        <nav aria-label="Menu">
          <ul className="mmenu__list">
            {[{ id: 'inicio', label: 'Início' }, ...navLinks].map((link, i) => (
              <li key={link.id} style={{ '--i': i }}>
                <a href={`#${link.id}`} className="mmenu__link" onClick={goFromMenu(link.id)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mmenu__footer" style={{ '--i': navLinks.length + 1 }}>
          <p>
            {store.address.street}, {store.address.city}
          </p>
        </div>
      </div>
    </>
  )
}
