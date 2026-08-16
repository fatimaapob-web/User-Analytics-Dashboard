// async function getUsers() {
//     const response = await fetch('https://jsonplaceholder.typicode.com/users');

//     if (!response.ok) {
      
//         console.log ("المستخدم  غير موجودة");
//         return;
//    }

//     const users = await response.json();
//     console.log (users);
// }

// getUsers();


async function getUsers() {
    const loading = document.getElementById("loading");


      try {
loading.style.display = "flex";

const [usersResponse, postsResponse, commentsResponse] = await Promise.all([
   fetch("https://jsonplaceholder.typicode.com/users"),
    fetch("https://jsonplaceholder.typicode.com/posts"),
    fetch("https://jsonplaceholder.typicode.com/comments")
]);
if (!usersResponse.ok || !postsResponse.ok || !commentsResponse.ok) {
    throw new Error("Failed to fetch data");
}
 
const users = await usersResponse.json();
const posts =  await postsResponse.json();
const comments =  await commentsResponse.json();

// الاحصائيات
document.getElementById("totalUsers").textContent = users.length;

document.getElementById("totalPosts").textContent = posts.length;

document.getElementById("totalComments").textContent = comments.length;

 

loading.style.display = "none";






// const userPosts = posts.filter(post => post.userId === 1); 

// const usersWithPosts = users.map(user => {
//     return posts.filter(post => post.userId === user.Id);
// });






const usersContainer = document.getElementById("usersContainer");


const usersWithPosts = users.map(user => {
    const userPosts = posts.filter(post => post.userId === user.id);
    const postsCount = userPosts.length;

  const userComments = comments.filter(comment => {
    return userPosts.some(post => post.id === comment.postId);
});


const commentsCount = userComments.length;
   

    return {
        id: user.id,
        name: user.name,
        email: user.email,
         phone: user.phone,
    website: user.website,
    username: user.username,
    address: user.address,
    company: user.company,
        postsCount,
        commentsCount
    };
});
console.log(usersWithPosts); 

// usersWithPosts.map(user => { 
    
//   const card = `<div class="card">
    
     
//      name: ${user.name},
//      email: ${user.email},
//      postsCount: ${user.postsCount},
//     commentsCount: ${user.commentsCount}


// </div> 
// `;  
//        usersContainer.innerHTML += card;
// });

function renderUsers(users) {

    usersContainer.innerHTML = "";

    const noUsersMessage = document.getElementById("noUsersMessage");

    if (users.length === 0) {
        noUsersMessage.style.display = "block";
        return;
    }

    noUsersMessage.style.display = "none";

    users.map(user => {

        const card = `
            <div class="card">
                <p> name: ${user.name}</p>
               <p> email: ${user.email}</p>
               <p> postsCount: ${user.postsCount}</p>
               <p> commentsCount: ${user.commentsCount}</p>
                       <button class="details-btn" data-id="${user.id}">
            View Details
        </button>
            </div>
        `;

        usersContainer.innerHTML += card;
    });
}

    renderUsers(usersWithPosts);
//  البحث باستخجام الاسم او الايميل
    const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", function () {
    const searchText = searchInput.value.toLowerCase();

    const filteredUsers = usersWithPosts.filter(user => {
        return user.name.toLowerCase().includes(searchText)
        ||
           user.email.toLowerCase().includes(searchText);
    });

    renderUsers(filteredUsers);
});

// View Details

usersContainer.addEventListener("click", function (event) {

    if (event.target.matches(".details-btn")) {

        const userId = Number(event.target.dataset.id);

        const user = usersWithPosts.find(user => user.id === userId);

        const userModal = document.getElementById("userModal");

        document.getElementById("modalName").textContent =
            user.name;

        document.getElementById("modalUsername").textContent =
            `Username: ${user.username}`;

        document.getElementById("modalEmail").textContent =
            `Email: ${user.email}`;

        document.getElementById("modalPhone").textContent =
            `Phone: ${user.phone}`;

        document.getElementById("modalWebsite").textContent =
            `Website: ${user.website}`;

        document.getElementById("modalAddress").textContent =
            `Address: ${user.address.street}, ${user.address.city}`;

        document.getElementById("modalCompany").textContent =
            `Company: ${user.company.name}`;

        userModal.style.display = "block";
    }

});


const closeModal = document.getElementById("closeModal");

closeModal.addEventListener("click", function () {
    document.getElementById("userModal").style.display = "none";
});

const userModal = document.getElementById("userModal");

userModal.addEventListener("click", function (event) {

    if (event.target === userModal) {
        userModal.style.display = "none";
    }

});
// // Sorting

// const sortSelect = document.getElementById("sortSelect");
// sortSelect.addEventListener("change", function () {
// const sortValue = sortSelect.value;

//  console.log("اختيار المستخدم:", sortValue);
// // ترتيب ابجدي باستخدام الاسم 
// if (sortValue === "name") {
//     usersWithPosts.sort((a, b) => {
//                return a.name.localeCompare(b.name)
        
//     });

//     renderUsers(usersWithPosts);
// }


// // ترتيب من الاعلى الى الاسفل حسب البوست 

// if (sortValue === "posts") {
//     usersWithPosts.sort((a, b) => {
//         return b.postsCount - a.postsCount;
//     });
//         renderUsers(usersWithPosts);
// }

// // ترتيب من الاعلى الى الاسفل حسب كومنت 

// if (sortValue === "comments") {
//     usersWithPosts.sort((a, b) => {
        
//         return b.commentsCount - a.commentsCount;
   
//     });

//     renderUsers(usersWithPosts);
// }
// });

// }

// Sorting
// const sortSelect = document.getElementById("sortSelect");
// sortSelect.addEventListener("change", function () {

//     console.log(usersWithPosts);
//     const sortValue = sortSelect.value;


//     if (sortValue === "name") {

//         usersWithPosts.sort((a, b) => {
//             return a.name.localeCompare(b.name);
//         });

//     }

//     if (sortValue === "posts") {

//         usersWithPosts.sort((a, b) => {
//             return b.postsCount - a.postsCount;
//         });

//     }

//     if (sortValue === "comments") {

//         usersWithPosts.sort((a, b) => {
//             return b.commentsCount - a.commentsCount;
//         });

//     }

//     renderUsers(usersWithPosts);

// });

const sortSelect = document.getElementById("sortSelect");

sortSelect.addEventListener("change", function () {

    const sortValue = sortSelect.value;

    const sortedUsers = [...usersWithPosts];

    if (sortValue === "name") {
        sortedUsers.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
    }

    if (sortValue === "posts") {
        sortedUsers.sort((a, b) => {
            return b.postsCount - a.postsCount;
        });
    }

    if (sortValue === "comments") {
        sortedUsers.sort((a, b) => {
            return b.commentsCount - a.commentsCount;
        });
    }

    renderUsers(sortedUsers);
});
     

// Most Active User
const mostActiveUser = usersWithPosts.reduce((max, user) => {
    return user.postsCount > max.postsCount ? user : max;
});

document.getElementById("activeUserName").textContent =
    mostActiveUser.name;

document.getElementById("activeUserPosts").textContent =
    `${mostActiveUser.postsCount} Posts`;

// ريفرش
const refreshBtn = document.getElementById("refreshBtn");

refreshBtn.addEventListener("click", function () {
    getUsers();
});
}
 
 catch (error) {
    const errorElement = document.getElementById("error");

    errorElement.textContent = "Failed to load dashboard data. Please try again.";

    loading.style.display = "none";
}
}
getUsers();








