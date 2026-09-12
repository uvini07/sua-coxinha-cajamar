import { Fragment } from 'react'
import { store, orderLabel } from '../../data/store.js'
import Button from '../Button.jsx'
import '../../styles/scenes/cta.css'

const headline = ['Bateu', 'a', 'fome?']

export default function FinalCTA() {
  const whatsapp = store.whatsapp ? `https://wa.me/${store.whatsapp}` : null

  return (
    <section id="pedido" className="scene scene--cta" aria-labelledby="pedido-title">
      <img className="cta__mascot" src="/assets/produtos/mascote.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />

      <div className="scene__inner cta">
        <div className="cta__main">
          <h2 id="pedido-title" className="cta__title display">
            {headline.map((word, i) => (
              <Fragment key={word}>
                <span className="cta__word">
                  <span className="cta__word-inner">{word}</span>
                </span>
                {i < headline.length - 1 && ' '}
              </Fragment>
            ))}
          </h2>
          <p className="cta__sub">Agora só falta pedir.</p>
          <div className="cta__actions">
            <Button href={store.links.order} size="big" variant="dark" external magnetic>
              {orderLabel}
            </Button>
            <Button href={store.links.maps} variant="ghost-dark" external>
              Como chegar
            </Button>
          </div>
        </div>

        <dl className="cta__info">
          <div>
            <dt>Endereço</dt>
            <dd>
              {store.address.street}
              <br />
              {store.address.district}, {store.address.city}
            </dd>
          </div>
          <div>
            <dt>Horário</dt>
            <dd>
              {store.hours.map((h) => (
                <span key={h.days} className="cta__hours">
                  {h.days}: {h.time}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt>Contato</dt>
            <dd>
              {whatsapp ? (
                <a className="link-underline" href={whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp {store.phone}
                </a>
              ) : (
                <a className="link-underline" href={`tel:+55${store.phone.replace(/\D/g, '')}`}>
                  {store.phone}
                </a>
              )}
              <br />
              <a className="link-underline" href={store.links.instagram} target="_blank" rel="noopener noreferrer">
                @suacoxinhacajamar
              </a>
            </dd>
          </div>
        </dl>

        <footer className="cta__footer">
          <p>{store.disclaimer}</p>
          <a className="link-underline" href={store.links.franchise} target="_blank" rel="noopener noreferrer">
            Seja um franqueado
          </a>
        </footer>
      </div>
    </section>
  )
}
