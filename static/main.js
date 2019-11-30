'use strict';

class Profile {
  constructor({
                username,
                name: {firstName, lastName},
                password,
              }) {
    this.username = username;
    this.name = {firstName, lastName};
    this.password = password;
  }

  createUser(callback) {
    return ApiConnector.createUser({username: this.username, name: this.name, password: this.password},
      (err, data) => {
        console.log(`Создание пользователя ${this.username}`);
        callback(err, data);
      });
  }

  performLogin(callback) {
    return ApiConnector.performLogin({username: this.username, password: this.password},
      (err, data) => {
        console.log(`Авторизация пользователя ${this.username}`);
        callback(err, data);
      });
  }

  addMoney({currency, amount}, callback) {
    return ApiConnector.addMoney({currency, amount},
      (err, data) => {
        console.log(`Начисление ${amount} ${currency} пользователю ${this.username}`);
        callback(err, data);
      });
  }

  convertMoney({fromCurrency, targetCurrency, targetAmount}, callback) {
    return ApiConnector.convertMoney({fromCurrency, targetCurrency, targetAmount},
      (err, data) => {
        console.log(`Конвертация ${fromCurrency} в ${targetAmount} ${targetCurrency}`);
        callback(err, data);
      });
  }

  transferMoney({to, amount}, callback) {
    return ApiConnector.transferMoney({to, amount},
      (err, data) => {
        console.log(`Перевод ${amount} Неткоинов пользователю ${to}`);
        callback(err, data);
      });
  }
}

function getStocks(callback) {
  return ApiConnector.getStocks((err, data) => {
    console.log(`Получение текущих курсов валют`);
    callback(err, data);
  })
}


function main() {
  let course;
  getStocks((err, data) => {
    if (err) {
      console.log(`Ошибка при получении курсов валют`);
    }
    course = data[data.length - 1].EUR_NETCOIN;
  });

  const son = new Profile({
    username: 'Сын',
    name: {firstName: 'Тимур', lastName: 'Анвартдинов'},
    password: '31415926',
  });

  const father = new Profile({
    username: 'Отец',
    name: {firstName: 'Ринат', lastName: 'Анвартдинов'},
    password: '27182818',
  });

  son.createUser((err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Пользователь создан`);
      son.performLogin((err, data) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Пользователь авторизован`);
          let amount = 500000;
          son.addMoney({currency: 'EUR', amount: amount}, (err, data) => {
            if (err) {
              console.error(err);
            } else {
              console.log(`Начисление ${amount} EUR пользователю`);
              let targetAmount = amount * course;
              son.convertMoney({fromCurrency: 'EUR', targetCurrency: 'NETCOIN', targetAmount: targetAmount},
                (err, data) => {
                  if (err) {
                    console.error(err);
                  } else {
                    console.log(`Конвертация в Неткоины`);
                    father.createUser((err, data) => {
                      if (err) {
                        console.error(err);
                      } else {
                        console.log(`Пользователь создан`);
                        son.transferMoney({to: father.username, amount: targetAmount}, (err, data) => {
                          if (err) {
                            console.log(`Перевод выполнен`);
                          } else {
                            console.log(`Пользователь ${father.username} получил ${targetAmount} Неткоинов`);
                          }
                        })
                      }
                    });
                  }
                })
            }
          })
        }
      })
    }
  })

}

main();