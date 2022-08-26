let section = document.querySelector("section");
let add = document.querySelector("form button");
add.addEventListener("click", e => {
    //prevent form from being submitted
    e.preventDefault();

    // get the input value
    let form = e.target.parentElement; //button的parent即form
    let todoText = form.children[0].value;  //再從form往下找它的cildren，就能找到所有子項
    let todoMonth = form.children[1].value; //加value就可以得到使用者輸入的值
    let todoDate = form.children[2].value;

    if (todoText === "") {                    //為了避免格子裡面沒有填入內容。
        alert("Please Enter some Text.");
        return;                              //return除了可以當回傳，在沒有要回傳的值時，也可以當「終止」，讓下面的程式就不會執行。
    }
    //creat a todo,同時將CSS的樣式加上去
    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = todoText;
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = todoMonth + "/" + todoDate;
    todo.appendChild(text);  //讓子項被父項包裹住
    todo.appendChild(time);

    //creat green check and red trash can
    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = '<i class="fas fa-check"></i>';
    completeButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
    })

    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;

        todoItem.addEventListener("animationend", () => {

            // remove from local storage
            let text = todoItem.children[0].innerText;
            let myListArray = JSON.parse(localStorage.getItem("list"));
            myListArray.forEach((item, index) => {
                if (item.todoText == text) {
                    myListArray.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(myListArray));
                }
            })
            todoItem.remove();
        })
        todoItem.style.animation = "scaleDown 0.3s forwards";
    })
    todo.appendChild(completeButton);
    todo.appendChild(trashButton);

    todo.style.animation = "scaleUp 0.3s forwards";


    //create an object（為了下方的store data設定的）
    let myTodo = {
        todoText: todoText,
        todoMonth: todoMonth,
        todoDate: todoDate
    };

    //store data into an array of objects
    let myList = localStorage.getItem("list"); //在這裡要找一個key是list的東西，後台會給你一個null，所以我們利用這個特性做if。
    if (myList == null) {
        localStorage.setItem("list", JSON.stringify([myTodo]));
    } else {                                  //如果myList裡面本來就有被放入東西的話,直接將它解析出來。
        let myListArray = JSON.parse(myList);
        myListArray.push(myTodo);
        localStorage.setItem("list", JSON.stringify(myListArray));
    }

    console.log(JSON.parse(localStorage.getItem("list")));

    form.children[0].value = ""; //讓Add into List這個按鈕被按下時，form.children[0].value就會被清空。
    section.appendChild(todo);
})


loadData(); //在網頁一開始就跑一次下方的function loadData()，叫出資料。

function loadData() {
    //load data(myList有東西的狀況下)
    let myList = localStorage.getItem("list");
    if (myList !== null) {
        let myListArray = JSON.parse(myList);
        myListArray.forEach(item => {

            // create a todo
            let todo = document.createElement("div");
            todo.classList.add("todo");
            let text = document.createElement("p");
            text.classList.add("todo-text");
            text.innerText = item.todoText;
            let time = document.createElement("p");
            time.classList.add("todo-time");
            time.innerText = item.todoMonth + " / " + item.todoDate;
            todo.appendChild(text);
            todo.appendChild(time);

            // create green check and red trash can
            let completeButton = document.createElement("button");
            completeButton.classList.add("complete");
            completeButton.innerHTML = '<i class="fas fa-check"></i>';

            completeButton.addEventListener("click", e => {
                let todoItem = e.target.parentElement;
                todoItem.classList.toggle("done");
            })

            let trashButton = document.createElement("button");
            trashButton.classList.add("trash");
            trashButton.innerHTML = '<i class="fas fa-trash"></i>';

            trashButton.addEventListener("click", e => {
                let todoItem = e.target.parentElement;

                todoItem.addEventListener("animationend", () => {

                    // remove from local storage
                    let text = todoItem.children[0].innerText;
                    let myListArray = JSON.parse(localStorage.getItem("list"));
                    myListArray.forEach((item, index) => {
                        if (item.todoText == text) {
                            myListArray.splice(index, 1);
                            localStorage.setItem("list", JSON.stringify(myListArray));
                        }
                    })
                    todoItem.remove();     //這句只讓它從HTML中被移除，要讓它從Storage中被移除，需要上面那些。
                })

                todoItem.style.animation = "scaleDown 0.3s forwards";
            })

            todo.appendChild(completeButton);
            todo.appendChild(trashButton);

            section.appendChild(todo);
        })
    }
}

//在後台先進行排序
function mergeTime(arr1, arr2) {
    let result = [];
    let i = 0;
    let j = 0;

    while (i < arr1.length && j < arr2.length) {
        if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {   //要加上Number是因為如果是個字串12月就會被判斷比2月小。
            result.push(arr2[j]);
            j++;
        } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
            result.push(arr1[i]);
            i++;
        } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
            if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
                result.push(arr2[j]);
                j++;
            } else {
                result.push(arr1[i]);
                i++;
            }
        }
    }

    while (i < arr1.length) {
        result.push(arr1[i]);
        i++;
    }
    while (j < arr2.length) {
        result.push(arr2[j]);
        j++;
    }

    return result;
}

function mergeSort(arr) {
    if (arr.length === 1) {
        return arr;
    } else {
        let middle = Math.floor(arr.length / 2);
        let right = arr.slice(0, middle);
        let left = arr.slice(middle, arr.length);
        return mergeTime(mergeSort(right), mergeSort(left));
    }
}

//將排序可以在前台顯示
let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
    // sort data
    let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(sortedArray));

    // remove data
    let len = section.children.length;
    for (let i = 0; i < len; i++) {
        section.children[0].remove();
    }

    //再跑一次上方的function loadData()，載入排序後資料。
    loadData();
})

//目前這個程式碼並沒有將按勾選後的效果儲存至Storage。