const BASE_URL = "http://localhost:8080";

function sendData() {
    return new Promise(async (resolve, reject) =>{
        try{
          let question = document.getElementById("question-text").value;
          let isCorrect = [];
          let options = [];

          for(let i = 1; i <= 2; i++) {
            let radio = document.getElementById("radio"+i);
            let option = document.getElementById("answer"+i).value;
            options.push(option);

            if (radio.checked) {
              isCorrect.push(1);
            }
            else {
              isCorrect.push(0);
            }
          }

          let res = await axios({
              method: 'post',
              url: BASE_URL + "/addQuestion",
              data: {
                  id: Math.random().toString(36).substring(7),
                  question: question,
                  isCorrect: isCorrect,
                  options: options
              },
              headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Max-Age': 2592000, // 30 days
              }
          })
          if(res) {
              resolve(res);
              location.reload();
            }
          else
              throw res
      }catch(e){
          console.log(e)
          reject("Failed.")
      }
  })
  }

  async function getQuestions() {
    return new Promise(async (resolve, reject) => {
      try{
        let res = await axios({
            method: 'get',
            url: BASE_URL + "/questions",
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Max-Age': 2592000, // 30 days
            }
        })
        if(res)
            resolve(res.data)
        else
            throw res
    }catch(e){
        console.log(e)
        reject("Failed.")
    }
  });
  }

function unhide() {
  let div = document.getElementById("new-question");
  div.style.display = "block";
}
