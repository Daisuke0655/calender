let difference = 0;
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
const currentDate = now.getDate();
const currentDay = now.getDay();
const leftArrow =  document.getElementById("iconArrowLeft");
const rightArrow = document.getElementById("iconArrowRight");
const holidayArray = [];
leftArrow.addEventListener("click",decrement);
rightArrow.addEventListener("click",increment);
calendar();

function getHolidays(calenderYear,calenderMonth,callback) {
  if(calenderMonth < 10) calenderMonth = String(calenderMonth).padStart(2, '0');
  const url = "http://api.national-holidays.jp/"+calenderYear + "-"+ calenderMonth;
  const apiURL = url;
  fetch(apiURL)
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(data => {
    if (data) {
      data.forEach(holiday => {
        const parts = holiday.date.split("-");
        holidayArray.push(parseInt(parts[2]));
      });
      callback();
    } else {
      console.error("取得したデータが空です。");
      callback();
    }
  })
  .catch(error => {
    console.error("エラーが発生しました:", error);
    holidayArray.push(0);
    callback();
});
}

function increment(){
  const tableElement = document.getElementById("table");
  tableElement.innerHTML = "";
  difference++;
  calendar();
}

function decrement(){
  const tableElement = document.getElementById("table");
  tableElement.innerHTML = "";
  difference--;
  calendar();
}

function calendar(){
  const array = new Array(6);
  let firstDay = new Date(currentYear,currentMonth+difference,1).getDay();
  let endDate = new Date(currentYear,currentMonth+difference+1,0).getDate();
  let calenderYear = new Date(currentYear,currentMonth+difference,1).getFullYear();
  let calenderMonth = new Date(currentYear,currentMonth+difference,1).getMonth()+1;
  let dateNumber = 1;
  document.getElementById("calenderYear").textContent   = calenderYear;
  document.getElementById("calenderMonth").textContent  = calenderMonth;
  getHolidays(calenderYear,calenderMonth,()=>{
    console.log(holidayArray);
    for(let i = 0; i < 6;i++){
      array[i] = new Array(7);
    }
    for(let i = 0;i < 6;i++){
        for(let j = 0;j < 7;j++){
            if(i == 0){
                if(j < firstDay) {
                  array[i][j] = "";
                }
                else if(j == firstDay){
                  array[i][j] = dateNumber;
                }else{
                    dateNumber++;
                    array[i][j] = dateNumber;
                }
            }else if(dateNumber != endDate){
              dateNumber++;
              array[i][j] = dateNumber;
            }else{
              array[i][j] = "";
            }
        }
        if(dateNumber == endDate){
          break;
        }
    }
    const tableElement = document.getElementById("table");
    array.forEach((item,num)=>{
      let tableRow = document.createElement('tr');
      let currentWeek = Math.floor((currentDate + firstDay)/7);
      if(Math.floor((currentDate + firstDay)%7)==0) currentWeek--;
      item.forEach((item,index)=>{
        const tableCell = document.createElement('td');
        tableCell.textContent = item;
        if(index == 0) {
          tableCell.style.color = "#ff838b";
        }else if(index == 6){
          tableCell.style.color = "#6fb5ff";
        }
        if(currentWeek==num&&currentDay==index&&difference == 0){
          tableCell.style.color = "#E00000";
        }
        holidayArray.forEach((element) => {
          if(element == index + num*7-firstDay+1){
            tableCell.style.color = "#ff838b";
          }
        });
        tableRow.appendChild(tableCell);
      });
      tableElement.appendChild(tableRow);
    });
  });
  holidayArray.splice(0);
}