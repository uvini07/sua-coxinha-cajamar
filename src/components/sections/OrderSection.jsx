import { useLoja } from '../../context/LojaContext.js'
import OrderButtons from '../OrderButtons.jsx'
import '../../styles/sections/order.css'

export default function OrderSection() {
  const loja = useLoja()
  const whatsapp = loja.whatsapp ? `https://wa.me/${loja.whatsapp}` : null

  return (
    <section id="pedido" className="order" data-theme="dark" aria-labelledby="pedido-title">
      <div className="order__inner">
        <div className="order__main">
          <h2 id="pedido-title" className="order__title display" data-reveal>
            {loja.textos.pedidoTitulo ?? 'Bateu a fome?'}
          </h2>
          <p className="order__sub" data-reveal>
            {loja.textos.pedidoSub ?? 'Monte seu pedido pelo WhatsApp e retire na loja.'}
          </p>
          <OrderButtons size="big" className="order__buttons" />
          {loja.links.maps && (
            <a className="btn btn--ghost order__map" href={loja.links.maps} target="_blank" rel="noopener noreferrer">
              <span className="btn__label">Ver a loja no mapa</span>
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
          )}
        </div>

        {loja.fotoLoja && (
          <figure className="order__photo" data-reveal>
            <img src={loja.fotoLoja.image} alt={loja.fotoLoja.alt} loading="lazy" decoding="async" />
            <figcaption>{loja.fotoLoja.caption}</figcaption>
          </figure>
        )}

        <dl className="order__info">
          <div>
            <dt>Endereço</dt>
            <dd>
              {loja.address.street}
              <br />
              {loja.address.district}, {loja.address.city}
            </dd>
          </div>
          <div>
            <dt>Horário</dt>
            <dd>
              {loja.hours.map((h) => (
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
                  WhatsApp {loja.phone}
                </a>
              ) : (
                <a href={`tel:+55${loja.phone.replace(/\D/g, '')}`}>Ligar: {loja.phone}</a>
              )}
              {loja.links.instagram && (
                <>
                  <br />
                  <a href={loja.links.instagram} target="_blank" rel="noopener noreferrer">
                    Instagram {loja.instagramHandle || loja.links.instagram.replace(/.*instagram\.com\//, '@').replace(/\/$/, '')}
                  </a>
                </>
              )}
            </dd>
          </div>
        </dl>

        <footer className="order__footer">
          <p>{loja.disclaimer}</p>
          {loja.links.franchise && (
            <a href={loja.links.franchise} target="_blank" rel="noopener noreferrer">
              Seja um franqueado
            </a>
          )}
        </footer>
      </div>
    </section>
  )
}
