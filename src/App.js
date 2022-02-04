import './App.css';
import { DATA_SESSIONS } from './Utils/data'
import * as dayjs from 'dayjs'


function App() {

  let streakDays = 0;
  let maximumStreak = 0;
  let lastStreakDay = null;
  let expectedNextDate = null;
  let formatedExpectedNextDate = null;
  let currentMonth = null;
  let currentYear = null;
  let currentDateFormated = '';

  const getStreakDays = ()=> {


  const dataSorted = DATA_SESSIONS.sort((a, b)=> b.dateSession - a.dateSession);

  dataSorted.forEach(session => {
    const currentDate = dayjs(session.dateSession);
    currentDateFormated = dayjs(session.dateSession).format('DD/MM/YYYY');
    const dayDate = dayjs(session.dateSession).date();
    const month = dayjs(session.dateSession).month();
    const year = dayjs(session.dateSession).year();
    const nextDay = dayjs(session.dateSession).add(1, 'day');
    const previousDay = dayjs(session.dateSession).subtract(1, 'day');
    const formatedPreviousDay = previousDay.format('DD/MM/YYYY');
    const isAfterCurrentYear = currentDate.isAfter(expectedNextDate, 'year');
    const isAfterCurrentMonth = currentDate.isAfter(expectedNextDate, 'month');

    const isPrevMonthAfterExpected = previousDay.isAfter(expectedNextDate, 'month');
    const isPrevDayAfterExpected = previousDay.isAfter(expectedNextDate, 'day');
    const isSessionCompleted = session.isSessionCompleted

  const continueStreak = () =>{

    if(dayDate === lastStreakDay){
      return null;
    }
    if (currentDateFormated === formatedExpectedNextDate){
      return successSession();
    }
    if(currentDateFormated > formatedExpectedNextDate){ //se resetea el streakDays
      streakDays = 0;
      return successSession();
    }else{
      if(isAfterCurrentYear){ //validacion cuando cambia el año
        if(isPrevDayAfterExpected){//valida que el dia del dia previo es mayor al expected
          streakDays = 0;
          return successSession();
        }
      }
      if(isAfterCurrentMonth){// para comparar el dia cuando cambia el mes

        if(isPrevMonthAfterExpected ){ //valida que el mes del dia previo es mayor al expected  
          streakDays = 0;
          return successSession();
        }
        if(isPrevDayAfterExpected){ //valida que el dia del dia previo es mayor al expected
          streakDays = 0;
          return successSession();
        }
        if(formatedPreviousDay === formatedExpectedNextDate){ //para los casos que no se alcanzan a validar con los if de arriba
          streakDays = 0;
          return successSession();
        }
      }
  }
      }

    function getStreakDayIfSessionCompleted(){
      if(isSessionCompleted){
        if (!lastStreakDay && !expectedNextDate){ // al comienzo esos campos están nulos, por lo que ejecutará una successSesion el resto de validaciones
          return successSession();
        }else{
          return continueStreak();
        }
      }
    }

    getStreakDayIfSessionCompleted();

    function successSession() {
      streakDays++;
      if (maximumStreak < streakDays){
        maximumStreak = streakDays;
      }
      lastStreakDay = dayDate;
      currentMonth = month;
      currentYear = year;
      expectedNextDate = nextDay;
      formatedExpectedNextDate = dayjs(expectedNextDate).format('DD/MM/YYYY'); //para ver la fecha esperada en los logs

    }
      });

      
  }

  getStreakDays();

  return (
    <div style={{height: '100vh', display:"flex", justifyContent: "center", alignItems: "center", margin: '5px 5px' }}>
        <div style={{width: '400px', backgroundColor: '#e5e5e5' ,textAlign: 'center', borderRadius: '15px' }}>
        <p style={{fontWeight: 'bold', marginBottom: '30px'}}>a la fecha: { currentDateFormated } se llevan {streakDays} streakDays</p>
        <p style={{fontWeight: 'bold'}}>racha máxima : {maximumStreak}</p>

        </div>

    

    </div>
  );
}

export default App;
