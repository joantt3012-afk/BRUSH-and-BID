/* =========================================================
BRUSH and BID
SHARED JAVASCRIPT
========================================================= */

(function () {

"use strict";


/* =====================================================
   API CONFIGURATION
===================================================== */

const API_BASE = "http://localhost:5000";

window.API_BASE = API_BASE;


/* =====================================================
   GET CURRENT USER
===================================================== */

function getCurrentUser() {

    const loggedIn =
        localStorage.getItem("loggedIn") === "true";

    const userId =
        localStorage.getItem("userId") ||
        localStorage.getItem("user_id") ||
        "";

    const name =
        localStorage.getItem("userName") ||
        "";

    const email =
        localStorage.getItem("userEmail") ||
        "";

    const rawRole =
        localStorage.getItem("userRole") ||
        "";

    let role = "";

    if (rawRole.toLowerCase() === "artist") {
        role = "Artist";
    }

    else if (rawRole.toLowerCase() === "bidder") {
        role = "Bidder";
    }

    else if (rawRole.toLowerCase() === "admin") {
        role = "Admin";
    }

    return {

        loggedIn: loggedIn,

        id: String(userId),

        user_id: String(userId),

        name:
            name ||
            email.split("@")[0] ||
            "User",

        email: email,

        role: role

    };

}


window.getCurrentUser = getCurrentUser;


/* =====================================================
   API FETCH HELPER
===================================================== */

window.apiFetch = async function (path, options = {}) {

    const config = {
        ...options,
        headers: {
            ...(options.headers || {})
        }
    };


    /*
     * Automatically convert JavaScript objects
     * into JSON.
     */

    if (
        config.body &&
        typeof config.body !== "string"
    ) {

        config.headers["Content-Type"] =
            "application/json";

        config.body =
            JSON.stringify(config.body);

    }


    const response =
        await fetch(
            API_BASE + path,
            config
        );


    let data = null;


    try {

        data =
            await response.json();

    }

    catch (error) {

        data = null;

    }


    if (!response.ok) {

        throw new Error(
            data?.message ||
            data?.error ||
            `Request failed (${response.status})`
        );

    }


    return data;

};


/* =====================================================
   ENSURE USER ID
===================================================== */

window.ensureUserId = async function () {

    const user =
        getCurrentUser();


    if (user.id) {

        return user.id;

    }


    if (
        !user.loggedIn ||
        !user.email
    ) {

        return "";

    }


    try {

        const data =
            await window.apiFetch(
                "/api/users"
            );


        const users =
            Array.isArray(data)
                ? data
                : (
                    data?.users ||
                    []
                );


        const found =
            users.find(
                item =>
                    String(
                        item.email || ""
                    ).toLowerCase() ===
                    user.email.toLowerCase()
            );


        if (!found) {

            return "";

        }


        const id =
            found.user_id ||
            found.id ||
            "";


        if (id) {

            localStorage.setItem(
                "userId",
                id
            );

        }


        return String(id);

    }

    catch (error) {

        console.error(
            "Unable to determine user ID:",
            error
        );

        return "";

    }

};


/* =====================================================
   ROLE NORMALIZATION
===================================================== */

function normalizeRole(role) {

    const value =
        String(role || "")
        .trim()
        .toLowerCase();


    if (value === "artist") {

        return "Artist";

    }


    if (value === "bidder") {

        return "Bidder";

    }


    if (value === "admin") {

        return "Admin";

    }


    return "";

}


window.normalizeRole =
    normalizeRole;


/* =====================================================
   PROFILE INITIAL
   Uses the FIRST LETTER of the EMAIL ADDRESS
===================================================== */

function getInitial(email) {

    const clean =
        String(
            email || ""
        ).trim();


    if (clean) {

        return clean
            .charAt(0)
            .toUpperCase();

    }


    return "U";

}


/* =====================================================
   PROFILE PAGE
===================================================== */

function getProfilePage(role) {

    role =
        normalizeRole(role);


    if (role === "Bidder") {

        return "bidderprofile.html";

    }


    if (role === "Artist") {

        return "artistprofile.html";

    }


    if (role === "Admin") {

        return "admindashboard.html";

    }


    return "#";

}


window.getProfilePage =
    getProfilePage;


/* =====================================================
   LOGOUT
===================================================== */

window.logoutUser = function () {

    const keys = [

        "loggedIn",

        "userId",

        "user_id",

        "userName",

        "userEmail",

        "userRole",

        "userPhone"

    ];


    keys.forEach(
        key =>
            localStorage.removeItem(key)
    );


    /*
     * Do not remove unrelated website data.
     *
     * Most importantly, passwords are never
     * stored here.
     */


    window.location.href =
        "index.html";

};


/* =====================================================
   PROFILE DROPDOWN
===================================================== */

window.toggleProfileMenu = function () {

    const menu =
        document.getElementById(
            "profileMenu"
        );


    if (!menu) {

        return;

    }


    menu.classList.toggle(
        "show"
    );

};


/* =====================================================
   BUILD ROLE MENU
===================================================== */

function buildRoleMenu(role) {

    const navbar =
        document.getElementById(
            "navbar"
        );


    if (!navbar) {

        return;

    }


    /*
     * Remove previously generated role menu.
     */

    navbar
        .querySelectorAll(
            "#roleMenu, .role-menu-generated"
        )
        .forEach(
            element =>
                element.remove()
        );


    role =
        normalizeRole(role);


    /*
     * No role = no role menu.
     */

    if (
        ![
            "Bidder",
            "Artist",
            "Admin"
        ].includes(role)
    ) {

        return;

    }


    const menu =
        document.createElement(
            "li"
        );


    menu.id =
        "roleMenu";


    menu.className =
        "dropdown role-menu-generated";


    let items = [];


    /* =================================================
       BIDDER MENU
    ================================================= */

    if (role === "Bidder") {

        items = [

            [
                "View Artworks",
                "viewartworks.html"
            ],

            [
                "Place Bid",
                "placebid.html"
            ],

            [
                "My Bids",
                "mybids.html"
            ],

            [
                "Profile",
                "bidderprofile.html"
            ]

        ];

    }


    /* =================================================
       ARTIST MENU
    ================================================= */

    else if (role === "Artist") {

        items = [

            [
                "Upload Artwork",
                "uploadartwork.html"
            ],

            [
                "My Artworks",
                "artist-artworks.html"
            ],

            [
                "View Auctions",
                "viewauctions.html"
            ],

            [
                "Profile",
                "artistprofile.html"
            ]

        ];

    }


    /* =================================================
       ADMIN MENU
    ================================================= */

    else if (role === "Admin") {

        items = [

            [
                "Dashboard",
                "admindashboard.html"
            ],

            [
                "Manage Users",
                "manageusers.html"
            ],

            [
                "Manage Artworks",
                "manageartworks.html"
            ],

            [
                "Manage Auctions",
                "manageauctions.html"
            ],

            [
                "Reports",
                "reports.html"
            ]

        ];

    }


    const dropdown =
        items
            .map(
                item =>

                `<li>
                    <a href="${item[1]}">
                        ${item[0]}
                    </a>
                </li>`

            )
            .join("");


    menu.innerHTML = `

        <a
            href="#"
            class="role-main-link">

            ${role} ▼

        </a>

        <ul
            class="dropdown-content">

            ${dropdown}

        </ul>

    `;


    navbar.appendChild(
        menu
    );


    const mainLink =
        menu.querySelector(
            ".role-main-link"
        );


    const dropdownElement =
        menu.querySelector(
            ".dropdown-content"
        );


    if (
        mainLink &&
        dropdownElement
    ) {

        mainLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                dropdownElement
                    .classList
                    .toggle("show");

            }
        );


        dropdownElement.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

            }
        );

    }

}


/* =====================================================
   SET HEADER
===================================================== */

function setHeader() {

    const user =
        getCurrentUser();


    const loginButton =
        document.getElementById(
            "loginBtn"
        );


    const profileArea =
        document.getElementById(
            "profileArea"
        );


    /*
     * USER NOT LOGGED IN
     */

    if (!user.loggedIn) {

        if (loginButton) {

            loginButton.style.display =
                "";

        }


        if (profileArea) {

            profileArea.style.display =
                "none";

        }


        buildRoleMenu("");

        return;

    }


    /*
     * USER LOGGED IN
     */

    if (loginButton) {

        loginButton.style.display =
            "none";

    }


    if (profileArea) {

        profileArea.style.display =
            "flex";

    }


    /* =================================================
       PROFILE ICON

       The first letter of the registered
       email address is displayed.

       Example:
       joantt3012@gmail.com → J
       alex@gmail.com       → A
       user@gmail.com       → U
    ================================================= */

    const icon =
        document.getElementById(
            "profileIcon"
        );


    if (icon) {

        icon.textContent =
            getInitial(
                user.email
            );

        icon.className =
            "profile-icon profile-initial";

        icon.title =
            user.email || user.name;

    }


    /* Profile name */

    const name =
        document.getElementById(
            "profileName"
        );


    if (name) {

        name.textContent =
            user.name;

    }


    /* Profile email */

    const email =
        document.getElementById(
            "profileEmail"
        );


    if (email) {

        email.textContent =
            user.email;

    }


    /* Profile role */

    const role =
        document.getElementById(
            "profileRole"
        );


    if (role) {

        role.textContent =
            user.role;

    }


    /* Profile page */

    const profilePage =
        document.getElementById(
            "profilePage"
        );


    if (profilePage) {

        profilePage.href =
            getProfilePage(
                user.role
            );

    }


    /*
     * Other pages may contain
     * these display elements.
     */

    const displayElements = [

        "profileDisplayName",

        "artistDisplayName",

        "adminDisplayName",

        "largeProfileName"

    ];


    displayElements.forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );


            if (element) {

                element.textContent =
                    user.name;

            }

        }
    );


    const largeRole =
        document.getElementById(
            "largeProfileRole"
        );


    if (largeRole) {

        if (
            user.role === "Admin"
        ) {

            largeRole.textContent =
                "Administrator";

        }

        else {

            largeRole.textContent =
                "Registered " +
                user.role;

        }

    }


    /*
     * Build role-specific navigation.
     */

    buildRoleMenu(
        user.role
    );

}


window.setHeader =
    setHeader;


/* =====================================================
   LOGIN LINK FROM OTHER PAGES
===================================================== */

function handleLoginRedirect() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    if (
        params.get("login") === "true" &&
        typeof window.openLogin ===
            "function"
    ) {

        window.openLogin();

    }

}


/* =====================================================
   DOCUMENT CLICK HANDLER
===================================================== */

document.addEventListener(
    "click",
    function (event) {

        /*
         * Close profile menu when
         * clicking outside it.
         */

        const profileArea =
            document.getElementById(
                "profileArea"
            );


        const profileMenu =
            document.getElementById(
                "profileMenu"
            );


        if (
            profileArea &&
            profileMenu &&
            !profileArea.contains(
                event.target
            )
        ) {

            profileMenu
                .classList
                .remove("show");

        }


        /*
         * Close role dropdown
         * when clicking outside.
         */

        const roleMenu =
            document.getElementById(
                "roleMenu"
            );


        if (
            roleMenu &&
            !roleMenu.contains(
                event.target
            )
        ) {

            const dropdown =
                roleMenu.querySelector(
                    ".dropdown-content"
                );


            if (dropdown) {

                dropdown
                    .classList
                    .remove("show");

            }

        }

    }
);


/* =====================================================
   INITIALIZE HEADER
===================================================== */

window.addEventListener(
    "DOMContentLoaded",
    function () {

        setHeader();

        handleLoginRedirect();

    }
);
 

})();


/* =========================================================
TERMS & CONDITIONS / PRIVACY POLICY
========================================================= */

(function () {

"use strict";


const POLICY_CONTENT = {

    terms: {

        title:
            "Terms & Conditions",

        html: `

            <h3>
                1. Account Use
            </h3>

            <p>
                Users must provide accurate information
                and keep their account credentials secure.
            </p>


            <h3>
                2. Artwork Submissions
            </h3>

            <p>
                Artists must submit original or lawfully
                owned artwork. Submissions are subject
                to administrative review.
            </p>


            <h3>
                3. Bidding
            </h3>

            <p>
                Bids are binding once submitted.
                A bidder should enter only amounts
                they are prepared to pay.
            </p>


            <h3>
                4. Auctions
            </h3>

            <p>
                Each weekly auction follows the
                published start and end time.
                The highest valid bid at closing
                is treated as the winning bid,
                subject to platform verification.
            </p>


            <h3>
                5. Prohibited Activity
            </h3>

            <p>
                Users must not manipulate bids,
                submit misleading information,
                or interfere with the operation
                of the platform.
            </p>


            <h3>
                6. Changes
            </h3>

            <p>
                BRUSH and BID may update these terms
                when necessary. Continued use after
                an update indicates acceptance.
            </p>

        `

    },


    privacy: {

        title:
            "Privacy Policy",

        html: `

            <h3>
                1. Information We Collect
            </h3>

            <p>
                We may store account, profile,
                artwork, bid, and shipping information
                needed to operate the auction platform.
            </p>


            <h3>
                2. How Information Is Used
            </h3>

            <p>
                Information is used to authenticate
                users, display profiles and artwork,
                process bids, administer auctions,
                and arrange delivery of winning artwork.
            </p>


            <h3>
                3. Data Protection
            </h3>

            <p>
                Reasonable technical and administrative
                measures should be used to protect
                stored information from unauthorized access.
            </p>


            <h3>
                4. Sharing
            </h3>

            <p>
                Information should only be shared when
                required to operate the service,
                complete delivery, comply with law,
                or with the user's consent.
            </p>


            <h3>
                5. Your Choices
            </h3>

            <p>
                Users can request correction of profile
                and shipping information through the
                relevant account pages.
            </p>


            <h3>
                6. Updates
            </h3>

            <p>
                This policy may be updated as the
                platform evolves.
            </p>

        `

    }

};


/* =====================================================
   CREATE POLICY MODAL
===================================================== */

function getPolicyModal() {

    let modal =
        document.getElementById(
            "policyModal"
        );


    if (modal) {

        return modal;

    }


    modal =
        document.createElement(
            "div"
        );


    modal.id =
        "policyModal";


    modal.className =
        "policy-modal";


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    modal.innerHTML = `

        <div
            class="policy-modal-box"
            role="dialog"
            aria-modal="true">

            <div
                class="policy-modal-header">

                <h2
                    id="policyModalTitle">
                </h2>

                <button
                    type="button"
                    class="policy-modal-close"
                    id="policyModalClose">

                    ×

                </button>

            </div>


            <div
                id="policyModalContent"
                class="policy-modal-content">
            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal ||
                event.target.id ===
                    "policyModalClose"
            ) {

                closePolicy();

            }

        }
    );


    return modal;

}


/* =====================================================
   OPEN POLICY
===================================================== */

function openPolicy(type) {

    const content =
        POLICY_CONTENT[type];


    if (!content) {

        return;

    }


    const modal =
        getPolicyModal();


    const title =
        document.getElementById(
            "policyModalTitle"
        );


    const body =
        document.getElementById(
            "policyModalContent"
        );


    if (title) {

        title.textContent =
            content.title;

    }


    if (body) {

        body.innerHTML =
            content.html;

    }


    modal.classList.add(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "policy-modal-open"
    );

}


/* =====================================================
   CLOSE POLICY
===================================================== */

function closePolicy() {

    const modal =
        document.getElementById(
            "policyModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "show"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "policy-modal-open"
    );

}


window.openPolicy =
    openPolicy;


window.closePolicy =
    closePolicy;


/* =====================================================
   POLICY LINKS
===================================================== */

document.addEventListener(
    "click",
    function (event) {

        const link =
            event.target.closest(
                "a"
            );


        if (!link) {

            return;

        }


        const href =
            (
                link.getAttribute(
                    "href"
                ) || ""
            ).toLowerCase();


        if (
            href.includes(
                "terms.html"
            )
        ) {

            event.preventDefault();

            openPolicy(
                "terms"
            );

        }


        else if (
            href.includes(
                "privacy.html"
            )
        ) {

            event.preventDefault();

            openPolicy(
                "privacy"
            );

        }

    },
    true
);


/* =====================================================
   ESCAPE TO CLOSE POLICY
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closePolicy();

        }

    }
);

})();