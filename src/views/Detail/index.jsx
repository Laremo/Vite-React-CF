import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import styles from './Detail.module.css';

const Detail = () => {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState({});
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const details = await fetch(
          `${import.meta.env.VITE_BASE_URL}/${eventId}?apikey=${
            import.meta.env.VITE_TM_API_KEY
          }`
        );
        const data = await details.json();
        setEventData(data);
        setIsLoading(false);
      } catch (error) {
        setEventData({});
        setError(error);
      }
    };
    fetchEventDetails();
  }, []);

  if (isLoading && Object.keys(eventData) === 0)
    return <div>Cargando detalles de evento...</div>;

  if (Object.keys(error) > 0) return <div> Ha ocurrido un error...</div>;

  return (
    <div className={styles.infoContainer}>
      <div className={styles.mainInfoContainer}>
        <img
          src={eventData?.images?.[0].url}
          alt={eventData?.name}
          className={styles.eventImage}
        />
        <h4 className={styles.eventName}>{eventData.name}</h4>
        <p className={styles.eventInfoParagraph}>{eventData.info}</p>
        {eventData?.dates?.start?.dateTime ? (
          <p className={styles.dateParagraph}>
            {format(
              new Date(eventData.dates.start.dateTime),
              'd LLLL yyyy H:mm ',
              { locale: es }
            )}
            hrs
          </p>
        ) : null}
      </div>

      <div className={styles.seatInfoContainer}>
        <h3 className={styles.seatMapTitle}>Mapa del evento</h3>
        <img
          src={eventData?.seatmap?.staticUrl}
          alt='Seatmap event'
        />
        <p className={styles.pleaseNoteLegend}>{eventData?.pleaseNote}</p>
        <p className={styles.priceRangeText}>
          Rango de precios {eventData?.priceRanges?.[0].min} -{' '}
          {eventData?.priceRanges?.[0].max}{' '}
          {eventData?.priceRanges?.[0].currency}
        </p>
      </div>
      <a href={eventData?.url}>Ir por tus boletos!</a>
    </div>
  );
};

export default Detail;
