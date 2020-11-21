//token = 6c72af4254daaa6ccabca6c1183c0727764829ac
async function fetcher(){
    const query = `{
        viewer{
            bio
            avatarUrl
            repositories(last:20, orderBy:{field: UPDATED_AT, direction: ASC}) {
                edges{
                    node{
                        name
                        forkCount
                        stargazerCount
                        description
                        primaryLanguage{
                            color
                            name
                        }
                        url
                        updatedAt
                    }
                }
            }
            name
            login
        }
    }`
    const method = {method:'POST', headers:{'Content-Type': 'application/json', 'Authorization':'Bearer '}, body: JSON.stringify({query})}
    const res = await fetch('https://api.github.com/graphql', method)
    const data = await res.json()
    let nrepo = {...data.data.viewer}
    let repo = data.data.viewer.repositories.edges
    repo = repo.map(i=>i.node)
    delete nrepo.repositories
    let new_data = {...nrepo, repositories: repo}
    //console.log(new_data)
    return new_data
}

window.onload= async function(){
    let data = await fetcher()
    document.getElementById('small-profile').src = data.avatarUrl
    document.getElementById('demo1').style.color = 'black'
    document.getElementById('demo1').style.borderBottom = '2px solid orange'
    document.getElementById('big-profile').src=data.avatarUrl
    document.getElementById('name').innerText = data.name
    document.getElementById('display').innerText = data.login
    document.getElementById('bio').innerText = data.bio

    let repositories = data.repositories.reverse()
    document.getElementById('notif').innerText = data.repositories.length
    document.getElementById('number').innerText = data.repositories.length
    //document.getElementById()
    repositories.map(i=>{
        repo(i)
    })
}

function bolden(item){
   let lis = document.getElementsByClassName('toppers')
   Object.keys(lis).map(i=>{
       lis[i].style.color='#555'
       lis[i].style.borderBottom = '0px'
   })
   document.getElementById(item).style.borderBottom = '2px solid orange'
   document.getElementById(item).style.color = 'black'; 
}
function repo(repo){
    let div = document.createElement('div')
    div.className = 'rep'
    div.innerHTML = `
        
        <div class='tup'>
            <a class='refer' href=${repo.url} target="_blank">
                <h3>${repo.name}</h3> 
            </a>
            <div class='star'>
                <i class="fas fa-star" style="background-color: white"></i><p>Star</p>
            </div> 
        </div>
        <div class='describe'>${repo.description?repo.description:""}</div>
        <div class='but'>
            <span><p class='circle' style="background-color: ${repo.primaryLanguage?repo.primaryLanguage.color:"green"}"></p> <p>${repo.primaryLanguage?repo.primaryLanguage.name:""}</p></span>
            <span><i class="fas fa-star" aria-hidden="true"></i><p class='starred'>${repo.stargazerCount} </p></span>
            <span><i class="fas fa-code-branch"></i> <p class='forked'>${repo.forkCount} </p></span>
            <p>Updated on ${dateParse(repo.updatedAt)} </p>
        </div>
    `
    document.getElementById('uphold').appendChild(div)
}
function dateParse(date){
    let data = new Date(date)
    let month = ['Jan','Feb','Mar','Apr','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return `${data.getDate()} ${month[data.getMonth()]}`
}