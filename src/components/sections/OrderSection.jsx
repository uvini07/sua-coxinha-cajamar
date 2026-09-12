import { store } from '../../data/store.js'
import OrderButtons from '../OrderButtons.jsx'
import '../../styles/sections/order.css'

export default function OrderSection() {
  const whatsapp = store.whatsapp ? `https://wa.me/${store.whatsapp}` : null

  return (
    <section id="pedido" className="order" data-theme="light" aria-labelledby="pedido-title">
      <div className="order__inner">
        <div className="order__main">
          <h2 id="pedido-title" className="order__title display" data-reveal>
            Bateu a fome?
          </h2>
          <p className="order__sub" data-reveal>
            Peça pelo aplicativo que você preferir. Ou venha até a loja.
          </p>
          <OrderButtons size="big" className="order__buttons" />
          <a className="btn btn--ghost-dark order__map" href={store.links.maps} target="_blank" rel="noopener noreferrer">
            <span className="btn__label">Ver a loja no mapa</span>
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </div>

        <figure className="order__photo" data-reveal>
          <img src="/assets/loja/placa.webp" alt="Placa redonda iluminada da Sua Coxinha, Coxinharia Gourmet, na frente da loja" loading="lazy" decoding="async" />
          <figcaption>Fachada amarela, com o letreiro da Sua Coxinha.</figcaption>
        </figure>

        <dl className="order__info">
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
                <span key={h.days} className="order__hours">
                  {h.days}: {h.time}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt>Contato</dt>
            <dd>
              {whatsapp ? (
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp {store.phone}
                </a>
              ) : (
                <a href={`tel:+55${store.phone.replace(/\D/g, '')}`}>Ligar: {store.phone}</a>
              )}
              <br />
              <a href={store.links.instagram} target="_blank" rel="noopener noreferrer">
                Instagram @suacoxinhacajamar
              </a>
            </dd>
          </div>
        </dl>

        <footer className="order__footer">
          <p>{store.disclaimer}</p>
          <a href={store.links.franchise} target="_blank" rel="noopener noreferrer">
            Seja um franqueado
          </a>
        </footer>
      </div>
    </section>
  )
}
