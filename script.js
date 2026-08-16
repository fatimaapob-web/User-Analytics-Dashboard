async function getUsers() {

    const loading = document.getElementById("loading");

    try {

        loading.style.display = "flex";

        const [usersResponse, postsResponse, commentsResponse] =
            await Promise.all([
                fetch("https://jsonplaceholder.typicode.com/users"),
                fetch("https://jsonplaceholder.typicode.com/posts"),
                fetch("https://jsonplaceholder.typicode.com/comments")
            ]);

        if (
            !usersResponse.ok ||
            !postsResponse.ok ||
            !commentsResponse.ok
        ) {
            throw new Error("Failed to fetch data");
        }

        const users = await usersResponse.json();
        const posts = await postsResponse.json();
        const comments = await commentsResponse.json();


        // =========================
        // الإحصائيات
        // =========================

        document.getElementById("totalUsers").textContent =
            users.length;

        document.getElementById("totalPosts").textContent =
            posts.length;

        document.getElementById("totalComments").textContent =
            comments.length;


        loading.style.display = "none";


        const usersContainer =
            document.getElementById("usersContainer");


        // =========================
        // تجهيز بيانات المستخدمين
        // =========================

        const usersWithPosts = users.map(user => {

            const userPosts = posts.filter(
                post => post.userId === user.id
            );

            const postsCount = userPosts.length;


            const userComments = comments.filter(comment => {

                return userPosts.some(
                    post => post.id === comment.postId
                );

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


        // =========================
        // Render Users
        // =========================

        function renderUsers(users) {

            usersContainer.innerHTML = "";

            const noUsersMessage =
                document.getElementById("noUsersMessage");


            if (users.length === 0) {

                noUsersMessage.style.display = "block";

                return;
            }


            noUsersMessage.style.display = "none";


            users.forEach(user => {

                const card =
                    document.createElement("div");


                card.className = "card";


                card.innerHTML = `

                    <p>Name: ${user.name}</p>

                    <p>Email: ${user.email}</p>

                    <p>Posts: ${user.postsCount}</p>

                    <p>Comments: ${user.commentsCount}</p>

                    <button
                        class="details-btn"
                        data-id="${user.id}">
                        View Details
                    </button>

                `;


                usersContainer.appendChild(card);

            });


            // تشغيل الـ Carousel
            startCarousel();

        }


        // =========================
        // البحث
        // =========================

        const searchInput =
            document.getElementById("searchInput");


        searchInput.addEventListener("input", function () {

            const searchText =
                searchInput.value.toLowerCase();


            const filteredUsers =
                usersWithPosts.filter(user => {

                    return (
                        user.name
                            .toLowerCase()
                            .includes(searchText)
                    )
                    ||
                    (
                        user.email
                            .toLowerCase()
                            .includes(searchText)
                    );

                });


            renderUsers(filteredUsers);

        });


        // =========================
        // View Details
        // =========================

        usersContainer.addEventListener(
            "click",
            function (event) {

                if (
                    event.target.matches(".details-btn")
                ) {

                    const userId =
                        Number(
                            event.target.dataset.id
                        );


                    const user =
                        usersWithPosts.find(
                            user => user.id === userId
                        );


                    if (!user) return;


                    const userModal =
                        document.getElementById(
                            "userModal"
                        );


                    document.getElementById(
                        "modalName"
                    ).textContent =
                        user.name;


                    document.getElementById(
                        "modalUsername"
                    ).textContent =
                        `Username: ${user.username}`;


                    document.getElementById(
                        "modalEmail"
                    ).textContent =
                        `Email: ${user.email}`;


                    document.getElementById(
                        "modalPhone"
                    ).textContent =
                        `Phone: ${user.phone}`;


                    document.getElementById(
                        "modalWebsite"
                    ).textContent =
                        `Website: ${user.website}`;


                    document.getElementById(
                        "modalAddress"
                    ).textContent =
                        `Address: ${user.address.street}, ${user.address.city}`;


                    document.getElementById(
                        "modalCompany"
                    ).textContent =
                        `Company: ${user.company.name}`;


                    userModal.style.display =
                        "block";
                }

            }
        );


        // =========================
        // إغلاق Modal
        // =========================

        const closeModal =
            document.getElementById("closeModal");


        closeModal.addEventListener(
            "click",
            function () {

                document.getElementById(
                    "userModal"
                ).style.display = "none";

            }
        );


        const userModal =
            document.getElementById("userModal");


        userModal.addEventListener(
            "click",
            function (event) {

                if (event.target === userModal) {

                    userModal.style.display =
                        "none";

                }

            }
        );


        // =========================
        // Sorting
        // =========================

        const sortSelect =
            document.getElementById("sortSelect");


        sortSelect.addEventListener(
            "change",
            function () {

                const sortValue =
                    sortSelect.value;


                const sortedUsers =
                    [...usersWithPosts];


                if (sortValue === "name") {

                    sortedUsers.sort(
                        (a, b) =>
                            a.name.localeCompare(
                                b.name
                            )
                    );

                }


                if (sortValue === "posts") {

                    sortedUsers.sort(
                        (a, b) =>
                            b.postsCount - a.postsCount
                    );

                }


                if (sortValue === "comments") {

                    sortedUsers.sort(
                        (a, b) =>
                            b.commentsCount -
                            a.commentsCount
                    );

                }


                renderUsers(sortedUsers);

            }
        );


        // =========================
        // Most Active User
        // =========================

        const mostActiveUser =
            usersWithPosts.reduce(
                (max, user) => {

                    return user.postsCount >
                        max.postsCount
                        ? user
                        : max;

                }
            );


        document.getElementById(
            "footerActiveUser"
        ).textContent =
            mostActiveUser.name;


        // =========================
        // Refresh
        // =========================

        const refreshBtn =
            document.getElementById(
                "refreshBtn"
            );


        refreshBtn.addEventListener(
            "click",
            function () {

                getUsers();

            }
        );


        // =========================
        // CAROUSEL
        // =========================

        let carouselIndex = 0;

        let carouselTimer;


        function startCarousel() {

            clearInterval(carouselTimer);


            const cards =
                usersContainer.querySelectorAll(
                    ".card"
                );


            if (cards.length === 0) {
                return;
            }


            carouselIndex = 0;


            updateCarousel();


            carouselTimer =
                setInterval(
                    function () {

                        carouselIndex++;


                        if (
                            carouselIndex >=
                            cards.length
                        ) {

                            carouselIndex = 0;

                        }


                        updateCarousel();

                    },
                    2500
                );

        }

function updateCarousel() {

    const cards =
        usersContainer.querySelectorAll(".card");

    if (cards.length === 0) {
        return;
    }

    const containerWidth =
        usersContainer.offsetWidth;

    const cardWidth =
        cards[0].offsetWidth;

    const gap = 30;

    /*
        مكان منتصف منطقة الكروت
    */

    const centerPosition =
        containerWidth / 2;

    /*
        مكان الكارت الحالي
    */

    const activePosition =
        carouselIndex *
            (cardWidth + gap)
        +
        cardWidth / 2;

    /*
        مقدار تحريك الكروت
    */

    const moveDistance =
        centerPosition -
        activePosition;


    /*
        تحريك وتكبير الكروت
    */

    cards.forEach(function (card, index) {

        const isActive =
            index === carouselIndex;

        card.style.transform =
            `translateX(${moveDistance}px) scale(${isActive ? 1.15 : 0.82})`;

        card.style.opacity =
            isActive ? "1" : "0.55";

        card.style.zIndex =
            isActive ? "10" : "1";


        /*
            إضافة active للكارت الموجود بالنص
        */

        card.classList.toggle(
            "active",
            isActive
        );

    });

}

        // أول عرض
        renderUsers(usersWithPosts);


        // تحديث عند تغيير حجم الشاشة
        window.addEventListener(
            "resize",
            function () {

                updateCarousel();

            }
        );

    }

    catch (error) {

        console.error(error);


        const errorElement =
            document.getElementById("error");


        errorElement.textContent =
            "Failed to load dashboard data. Please try again.";


        loading.style.display = "none";

    }

}


getUsers();