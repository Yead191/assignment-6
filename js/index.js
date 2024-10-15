// spinner
const showSpinner = () => {
    document.getElementById('spinner').classList.remove('hidden')
    document.getElementById('displayPets').classList.add('hidden')
};

const hideSpinner = () => {
    setTimeout(() => {
        document.getElementById('spinner').classList.add('hidden')
        document.getElementById('displayPets').classList.remove('hidden')
    }, 2000)
}


// removeActiveClass
const removeActiveClass = () => {
    const buttons = document.getElementsByClassName('category-btn')
    for (let btn of buttons) {
        btn.classList.remove('bg-[#047E86]', 'rounded-full' , 'text-white')

    }


}

// load all pets
const loadAllPets = async () => {
    showSpinner();


    const response = await fetch(`https://openapi.programming-hero.com/api/peddy/pets`)
    const data = await response.json()
    hideSpinner();



    displayAllPets(data.pets)



}

// load categories
const loadCategories = async () => {
    const response = await fetch(`https://openapi.programming-hero.com/api/peddy/categories`)
    const data = await response.json()
    displayCatagories(data.categories)
}

const displayCatagories = (cat) => {
    const catContainer = document.getElementById('categoriesContainer')

    cat.forEach(item => {

        const btnContainer = document.createElement('div')
        btnContainer.innerHTML = `
        
        
        <button id='${item.category}' onclick="loadCatPet('${item.category}')" class='category-btn text-xl w-full  lg:px-6 lg:w-[312px] h-[90px] border border-[#0E7A81] btn bg-transparent category-btn'> <span class='mr-3'><img src="${item.category_icon}" alt=""></span> ${item.category}</button>
       
        
        `
        catContainer.append(btnContainer)

    });
}




// load pets by categories
const loadCatPet = async (catId) => {
    showSpinner();

    const res = await fetch(`https://openapi.programming-hero.com/api/peddy/category/${catId}`)
    const data = await res.json()
    hideSpinner();


    removeActiveClass()


    const activeBtn = document.getElementById(`${catId}`)
    activeBtn.classList.add('rounded-full', 'bg-[#047E86]', 'text-white')

    // remove sort btn styles
    const activeSortBtn = document.getElementById(`sortBtn`)
    activeSortBtn.classList.remove('bg-[#0E7A81]', 'rounded-full', 'text-white')


    // console.log(data);
    displayAllPets(data.data);
}



// display pets

const displayAllPets = (pets) => {



    const petContainer = document.getElementById('displayPets')
    petContainer.innerHTML = ''

    if (pets.length == 0) {
        petContainer.classList.remove('grid')
        petContainer.innerHTML = `
        <div class='flex flex-col gap-y-4 text-center justify-center items-center bg-gradient-to-b from-[#F4F4F4] to-white rounded-lg min-h-[600px]'>
        <img src='images/error.webp'/>
        <h1 class='text-3xl font-bold'>No Information Available</h1>
        <p class='text-gray-500'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at 
its layout. <br> The point of using Lorem Ipsum is that it has a.</p>

        </div>
        `
        return


    }
    else {
        petContainer.classList.add('grid')

    }

    pets.forEach(pet => {
        const petCard = document.createElement('div')
        petCard.innerHTML = `
        <div class="card card-compact border">
  <figure class=''>
    <img class='rounded-3xl w-full h-[250px] p-4'
      src="${pet.image}" />
  </figure>
  <div class="p-4 ">
    <h2 class="card-title">${pet.pet_name}</h2>
    <div class='flex gap-1 items-center'>
    <img src="images/icons/home.png" />
    <p> Breed: ${pet.breed ? pet.breed : `<span class='text-red-600'>404 Not Found</span>`} </p>

   </div>
   <p> <i class="fa-solid fa-calendar-days mr-1"></i> Birth:  ${pet.date_of_birth ? pet.date_of_birth : `<span class='text-red-600'>404 Not Found</span>`}</p>
   <p> <i class="fa-solid fa-mercury mr-1"></i> Gender:  ${pet.gender ? pet.gender : `<span class='text-red-600'>404 Not Found</span>`}</p>
   <p class=' mb-3'>$ Price: ${pet.price ? `${pet.price}$` : `<span class='text-red-600'>404 Not Found</span>`}</p>
    
    <div class="border-t  card-actions justify-around">
      <button onclick='likeHistory("${pet.image}")' class="mt-3 btn btn-sm bg-transparent  "><i class="fa-regular fa-thumbs-up"></i></button>
      <button id='adoptBtn-${pet.petId}' onclick="loadAdoptDetails(${pet.petId})" class="mt-3 btn btn-sm bg-transparent text-[#0E7A81 hover:bg-[#0E7A81] hover:text-white ">Adopt</button>
      <button onclick="loadDetails(${pet.petId})" class="mt-3 btn btn-sm bg-transparent text-[#0E7A81 hover:bg-[#0E7A81] hover:text-white ">Details</button>
    </div>
  </div>
</div>
        `
        petContainer.append(petCard)



        // console.log(pet);

    });


}
// load adopt btn
const loadAdoptDetails = async (adoptId) => {
    const res = await fetch(`https://openapi.programming-hero.com/api/peddy/pet/${adoptId}`)
    const data = await res.json()
    adoptDetails(data.petData)


}


// adopt btn
const adoptDetails = (adopt) => {


    const adoptModal = document.getElementById('adoptModal')
    adoptModal.innerHTML = `
    <div class='flex flex-col justify-center text-center items-center '>
    <img class='rounded-md w-full' src='${adopt.image}'/>
    <h4 class="card-title my-4 text-center text-lime-500 text-3xl mb-1">Congratulations!! </h4>
    <h4 class="card-title my-4 text-center">You have adopted <span class='text-fuchsia-600 text-2xl'>${adopt.pet_name} </span> successfully!</h4>
    </div>
    <p class='text-gray-500 my-0'>Adoption Process is Start For Your Pet</p>
    <p id='countdown' class='text-black my-0 text-6xl'>3</p>


     
    
    `
    // console.log(adopt);
    document.getElementById('modalAdopt').showModal()

    // countdown
 
    let countdown = 3
    const cdInterval = setInterval(() => {
        countdown--
        document.getElementById('countdown').innerText = countdown

        if (countdown === 0) {
            clearInterval(cdInterval)
            modalAdopt.close()
            const adoptBtn = document.getElementById(`adoptBtn-${adopt.petId}`)

            if (adoptBtn) {
                adoptBtn.innerText = 'Adopted'
                adoptBtn.disabled = true

            }
        }
    }, 1000)
}

// load details
const loadDetails = async (petId) => {
    const res = await fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`)
    const data = await res.json()
    displayDetails(data.petData);
}


const displayDetails = (details) => {
    const modalContent = document.getElementById('modalContent')
    modalContent.innerHTML = `
    <img class='rounded-md w-full' src='${details.image}'/>
    <h4 class="card-title my-4">${details.pet_name}</h4>
    
    <div class='grid grid-cols-2 border-b'>
    <div class='flex gap-1 items-center'>
    <img src="images/icons/home.png" />
    <p> Breed: ${details.breed ? details.breed : `<span class='text-red-600'>404 Not Found</span>`} </p>

   </div>
   <p> <i class="fa-solid fa-calendar-days mr-1"></i> Birth:  ${details.date_of_birth ? details.date_of_birth : `<span class='text-red-600'>404 Not Found</span>`}</p>
   <p> <i class="fa-solid fa-mercury mr-1"></i> Gender:  ${details.gender ? details.gender : `<span class='text-red-600'>404 Not Found</span>`}</p>
   <p class=''>$ Price: ${details.price ? details.price : `<span class='text-red-600'>404 Not Found</span>`}$</p>
   <p class='mb-2'><i class="fa-solid fa-mercury mr-1"></i> Vaccinated status: ${details.vaccinated_status ? details.vaccinated_status : `<span class='text-red-600'>404 Not Found</span>` }</p>
    



    </div>
    <p class='my-5  text-sm text-gray-500'>Details Information: <br>
    <br>
    ${details.pet_details}</p>
     <div class="">
                        <form method="dialog">
                           
                            <button class="btn w-full">Close</button>
                        </form>
    `

    document.getElementById('customModal').showModal()


}

// like history

const likeHistory = (likeImg) => {
    const likeContainer = document.getElementById('likeContainer')
    const like = document.createElement('div')
    like.innerHTML = `
    <img class='w-auto rounded-lg' src='${likeImg}' />
    `
    likeContainer.append(like)

}

/**
 * demo object
 * {
    "petId": 12,
    "breed": "Poodle",
    "category": "Dog",
    "date_of_birth": "2023-08-10",
    "price": 1500,
    "image": "https://i.ibb.co.com/R9ZHvDD/pet-12.jpg",
    "gender": "Female",
    "pet_details": "This elegant female Poodle, born on August 10, 2023, is intelligent and eager to learn. Fully vaccinated and priced at $1500, she's perfect for families looking for a trainable and loving companion.",
    "vaccinated_status": "Fully",
    "pet_name": "Chloe"
}
 */





// sort btn
const shortBtn = async ()=>{
    showSpinner();


    const response = await fetch(`https://openapi.programming-hero.com/api/peddy/pets`)
    const data = await response.json()
    hideSpinner();

    const sortPets = data.pets

    sortPets.sort((a,b)=> b.price - a.price)
    console.log(sortPets);

    removeActiveClass()

    const activeBtn = document.getElementById(`sortBtn`)
    activeBtn.classList.add('bg-[#0E7A81]', 'rounded-full', 'text-white')



    displayAllPets(sortPets)

}



loadAllPets()

loadCategories()


