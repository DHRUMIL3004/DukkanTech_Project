const ItemSearch = ({setSearch}) => {

  return(

    <input
      className="form-control mb-3"
      placeholder="Search item"
      onChange={(e)=>setSearch(e.target.value)}
    />

  )

}

export default ItemSearch;