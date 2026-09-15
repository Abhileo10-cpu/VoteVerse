import Navbar from "../components/Navbar";

function MyVote(){

const voter=JSON.parse(localStorage.getItem("voter"));

return(

<>
<Navbar/>

<div style={{padding:"30px"}}>

<h1>My Voting History</h1>

{voter?.voteHistory?.length===0?

<p>No previous votes.</p>

:

voter.voteHistory.map((vote,index)=>(

<div key={index} style={{
background:"white",
padding:"20px",
marginBottom:"20px",
borderRadius:"12px"
}}>

<h3>{vote.election}</h3>

<p><strong>Candidate:</strong> {vote.candidateName}</p>

<p><strong>Party:</strong> {vote.party}</p>

<p><strong>Constituency:</strong> {vote.constituency}</p>

<p>{new Date(vote.votedAt).toLocaleString()}</p>

</div>

))

}

</div>
</>

)

}

export default MyVote;