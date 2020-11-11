const store = {
  day: ["пн", "вт", "ср", "чт", "пт"],
  time: {
    hourBegin: [9, 9, 9, 9, 9],
    minutesBegin: [0, 0, 0, 0, 0],
    hourEnd: [17, 17, 17, 17, 17],
    minutesEnd: [0, 0, 0, 0, 0],
    workedOut: [],
  },
  dinner: [60, 60, 60, 60, 60],
  fullWorkedOut: 36,
  calcWorkedOut( index ) {
    for (let i = 0; i < 5; i++) {
      if ( index === undefined ) { 
        this.time.workedOut[i] =
          ( (this.time.hourEnd[i] + this.time.minutesEnd[i] / 60) -
          (this.time.hourBegin[i] + this.time.minutesBegin[i] / 60) ) - this.dinner[i]/60;
      } else {
        i = +index;
        this.time.workedOut[i] =
        ( (this.time.hourEnd[i] + this.time.minutesEnd[i] / 60)  -
          (this.time.hourBegin[i] + this.time.minutesBegin[i] / 60) ) - this.dinner[i]/60;
          break;
      }
    }   
    this.calcFullWorkedOut(); 
  },
  calcFullWorkedOut() {
    let sum = 0;
    this.time.workedOut.forEach((item, i) => {
      sum += item;
    });
    this.fullWorkedOut = sum;
  },
  calcAttribute( name, id ) {
    let value = 0;
    const key = id.substr(0, id.length - 1);
    i = +id.substr(-1); 
    if( name === 'positive') {
      key.substr(0,7) === 'minutes' || key === 'dinner' ? value = 5 : value = 1;
    } else {
      key.substr(0,7) === 'minutes' || key === 'dinner' ? value = -5 : value = -1;
    }
    return [value,key,i];
  },
  setValue( name, id ) {
    const [value, key, i] = this.calcAttribute(name, id);
    if( key !== 'dinner') {
      const newValue = this.time[key][i] + value;
      if( this.checkEnterValue( key, newValue ) ) {
        this.time[key][i] = this.time[key][i] + value;
      } else { 
        this.time[key][i] = this.time[key][i];
      }
    } else {
      const newValue = this.dinner[i] + value;
      if( this.checkEnterValue( key, newValue )) {  
        this.dinner[i] = this.dinner[i] + value;
      }else { 
        this.dinner[i] = this.dinner[i];
      }
    }
    this.renderElement( key, i, name );
  },
  controlLengthOutput( value ) { 
    this.calcWorkedOut( i );
    function isInteger(num) {
      return (num ^ 0) === num;
    }
    if (isInteger(+value)) {
      return +value;
    } 
    if ( +value.substr(-1) === 0 ) {
      return value.substr(0, value.length - 1);
    } else {
      return value;
    }
  },
  renderElement( key, i, name ) {
    if ( key !== 'dinner') {
      document.getElementById(key+i).children[0].innerHTML = this.time[key][i];
    } else {
      this.renderDinner( key, i );
    }
    this.renderMinutes( key, i, name );
    this.calcWorkedOut( i );
    document.getElementById('workedOut'+i).children[0].innerHTML = this.controlLengthOutput(this.time.workedOut[i].toFixed(2)) + ' ч';
    document.getElementById('fullWorkedOut').innerHTML = this.controlLengthOutput(this.fullWorkedOut.toFixed(2)) + ' ч';
  },
  renderDinner( key, i ) {
    if ( this[key][i] >=60 ) {
      document.getElementById(key+i).children[0].innerHTML = this[key][i]/60 +'ч';
    } else { 
      if (this[key][i] === 0 ) {
        document.getElementById(key+i).children[0].innerHTML = this[key][i];
      } else {
        document.getElementById(key+i).children[0].innerHTML = this[key][i] +'м';
      } 
    }
  },
  renderMinutes( key, i, name ) {
    if ( key !== 'dinner' ) {
      let hour = '';
      let newValue = '';

      key.substr(7) === 'Begin' ? hour = 'hourBegin' : hour = 'hourEnd';
      name === 'positive' ? newValue = 1 : newValue = -1;

      if ( this.time[key][i] >= 60  || this.time[key][i] < 0) {
         if  ( this.time[key][i] >= 60 ) {
          this.time[key][i] = 0;
          document.getElementById(key+i).children[0].innerHTML = 0;
        } else if ( this.time[key][i] < 0 ) {
          this.time[key][i] = this.time[key][i] + 60;
          document.getElementById(key+i).children[0].innerHTML = this.time[key][i];
        } 
        const newValueHour = this.time[hour][i] + newValue;
        if ( this.checkEnterValue( hour, newValueHour ) ) { 
          this.time[hour][i] = newValueHour;
          document.getElementById(hour+i).children[0].innerHTML = this.time[hour][i];
        } 
      }
    }
  },
  renderHtml(idRoot) {
    this.calcWorkedOut();
    const controlElements = ` 
    <div class="control_element">
      <div class="positive" 
        onclick="store.setValue(this.className, this.parentNode.parentNode.id);">+</div>
      <div class="negative" 
        onclick="store.setValue(this.className, this.parentNode.parentNode.id);">-</div>
    </div>`
    const tempArr = [];
    tempArr.push(`
    <div class="row_top">
      <div class="element_top" >
        <div class="element_top__header">
          Начало работы
        </div>
        <div class="element_top__footer">
          <div>час</div>
          <div>мин</div>
        </div>
      </div>
      <div class="element_top__dinner" >
        Обед
      </div>
      <div class="element_top" >
        <div class="element_top__header">
          Конец работы
        </div>
        <div class="element_top__footer">
          <div>час</div>
          <div>мин</div>
        </div>
      </div>
      <div class="element_top_workedOut" >
        Отработано за день
      </div>
    </div>
    `);
    for (let i = 0; i < this.day.length; i++) {
     tempArr.push(
        `
        <div class="row_time" id="row_time${i}">
          <div class="begin">
            <div class="element" id="hourBegin${i}">
              <div>${this.time.hourBegin[i]}</div>
              ${controlElements}
            </div>
            <div class="delimiter"> : </div>
            <div class="element" id="minutesBegin${i}">
              <div>${this.time.minutesBegin[i]}</div>
              ${controlElements}
            </div>
          </div>
          <div class="delimiter">  </div>
          <div class="element dinner" id="dinner${i}">
            <div>${this.dinner[i] == 60 ? '1ч' : this.dinner[i] + ' м'}</div>
            ${controlElements}
          </div>
          <div class="delimiter">  </div>
          <div class="begin">
            <div class="element" id="hourEnd${i}">
              <div>${this.time.hourEnd[i]}</div>
              ${controlElements}
            </div>
            <div class="delimiter"> : </div>
            <div class="element" id="minutesEnd${i}">
              <div>${this.time.minutesEnd[i]}</div>
              ${controlElements}
            </div>
          </div>
          <div class="element_workedOut" id="workedOut${i}">
            <div>${this.time.workedOut[i]} ч</div>
          </div>
        </div>`);  
    }   
    idRoot.innerHTML = tempArr.join("");
  },
  checkEnterValue( key, newValue ) { 
    switch (key) {
      case 'hourBegin':
        if ( newValue >= 7 && newValue <= 12 ) {
          return true;
        }           
        return false;
        break;
      case 'minutesBegin':
        if ( newValue >= -60 && newValue <= 60 ) {
          return true;
        }           
        return false;
        break;
      case 'hourEnd':
        if ( newValue >= 12 && newValue <= 23 ) {
          return true;
        }           
        return false;
        break;
      case 'minutesEnd':
        if ( newValue >= -60 && newValue <= 60 ) {
          return true;
        }           
        return false;
        break;
      case 'dinner':
        if ( newValue >= 0 && newValue <= 60 ) {
          return true;
        }           
        return false;
        break;
    
      default:
        break;
    }
  }
  ,
  checkLimitWorkedOut( fullWorkedOut, limitWorkedOut ) {
    if ( fullWorkedOut <= limitWorkedOut ) {
      return true;
    } else {
      return false;
    }
  }
};

const root = document.getElementById("root");
const fullWorkedOut = document.getElementById('fullWorkedOut');
store.renderHtml(root, fullWorkedOut);