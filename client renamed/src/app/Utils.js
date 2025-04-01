   // returns a list of dates from starting date to 'howManyDates' in the past
   // only works for 1 - 20 days long TODO check day and months for leading zeros when changing years
   const listOfPastDates = (startingDate) => {
    // start with empty array to fill with dates
    let listOfDateKeys = [];
    let howManyDates = 5; // how many past dates do we want to go?
    
    //console.log(startingDate.substring(6,8))
    // won't include today's date if x=1. to include today's date let x=0
    for (let x = 0; x<=howManyDates; x++) {
         // get day component
      let dayStr = startingDate.substring(4,6);
      let yearStr = startingDate.substring(0,4);
      let monthStr = startingDate.substring(6,8);
      let dayNum = parseInt(dayStr);
      let yearNum = parseInt(yearStr);
      let monthNum = parseInt(monthStr);
      
      let newDayNum = dayNum - x;
      // check if you need to go to the next month or year
      if (newDayNum <= 0) {
          // need to decrease the month because the new day is a 0 or less
          let newMonthNum = monthNum - 1
        
        // need to check if year needs to be changed
        if (newMonthNum<=0) {
            let newYearNum = yearNum - 1 // previous year
          
          // subtract days from correct month end point  
             let newDayNumAfterMonthChange = 31+newDayNum;
          // date must be xxxx3112-x dec31th starting point of new year
          let newFullDateStr = newYearNum.toString() + newDayNumAfterMonthChange.toString() + "12"
          listOfDateKeys.push(newFullDateStr);
          
        } else {
          // new month is good to go, just need to handle days now
          // need to use the right starting month-end-number-of-days
          let newMonthEndDays = 31
          switch(newMonthNum) {
                          case 2:
                newMonthEndDays = 28
                break;
            case 4:
                newMonthEndDays = 30
              break;
            case 6:
                newMonthEndDays = 30
              break;
            case 9:
                newMonthEndDays = 30
              break;
            case 11:
                newMonthEndDays = 30
              break;
            default:
                newMonthEndDays = 31
            }
          // subtract days from correct month end point  
             let newDayNumAfterMonthChange = newMonthEndDays+newDayNum;
          
          // build new month string
          let newMonthStr = newMonthNum.toString();
          if (newMonthStr <= 9) {
              newMonthStr = "0"+newMonthStr;
          }
          // build full new date with new month and days
          let newFullDateStr = yearStr + newDayNumAfterMonthChange + newMonthStr
          listOfDateKeys.push(newFullDateStr);
        }
        
      } else {
        // new day number is ok to use with current month/year.
        let newDayStr = newDayNum.toString();
        // check if day needs a 0 prefix 
        if (newDayNum <=9) {
            newDayStr = "0"+newDayStr;
        }
        let newFullDateStr = yearStr + newDayStr + monthStr
        //console.log(newFullDateStr)
        listOfDateKeys.push(newFullDateStr)
      }
    }
    console.log(listOfDateKeys);
    return listOfDateKeys
  }


  export {
    listOfPastDates
  }