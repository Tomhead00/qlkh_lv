import { Link, useLocation } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState, useEffect, useRef } from "react"
import moment from "moment"
const {REACT_APP_SERVER} = process.env

function StoredCourses() {
  const location = useLocation()
  const [course, setCourse] = useState([]);
  const [deletedCount, setDeletedCount] = useState(0);
  const [nameCourse, setNameCourse] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [req, setReq] = useState('');
  const [result, setResult] = useState('');
  const [courseIds, setCourseIds] = useState([]);
  const [action, setAction] = useState('');
  const containerForm = $('form[name="container-form"]')
  const [boolean, setBoolean] = useState(true)
  const icons = useRef({
    default: 'oi oi-elevator',
    asc: 'oi oi-sort-ascending',
    desc: 'oi oi-sort-descending',
  });
  const types = useRef({
    asc: 'desc',
    desc: 'asc',
  })
  const [column, setColumn] = useState([
    {icon: icons.current.default, type: "desc"},
    {icon: icons.current.default, type: "desc"},
    {icon: icons.current.default, type: "desc"},
    {icon: icons.current.default, type: "desc"},
    {icon: icons.current.default, type: "desc"},
  ]);

  // function
  const handleAction = (e) => {
    setAction(e.target.value)
  }

  // toggle checked
  useEffect(() => {
    const checkboxAll = $('#checkbox-all')
    const courseItemCheckbox = $('input[name="courseIds[]"]')
    // Checkbox all
    checkboxAll.change(function (){
      var isCheckedAll = $(this).prop('checked');
      // console.log(isCheckedAll, courseItemCheckbox);
      courseItemCheckbox.prop("checked", isCheckedAll);
      renderCheckAllSubmitBtn();
    })
    // Course item checked
    courseItemCheckbox.change(function () {
      var isCheckedAll = courseItemCheckbox.length === $('input[name="courseIds[]"]:checked').length
      checkboxAll.prop('checked', isCheckedAll);
      renderCheckAllSubmitBtn();
    });
    // Re-render check submit all button
    const renderCheckAllSubmitBtn = () => {
      var checkedCount = $('input[name="courseIds[]"]:checked').length;
      if(checkedCount > 0) {
        setBoolean(false)
      } else {
        setBoolean(true)
      }
    }
  })

  const handleCheckAllSubmitBtn = (e) => {
    containerForm.submit(function(e){
      return false;
    });
    if (action !== "") {
      let checked = []
      for(var i=0; i<$('input[name="courseIds[]"]:checked').length; i++) {
        checked.push($('.courseId:checked')[i].value)
      }
      setCourseIds(checked)
      window.$('#deleteAll-course-model').modal('toggle');
    }
  }
    
  const handleAllCourse = () => {
    // console.log(action, courseIds);
    axios({
      method: "post",
      data: {
          action: action,
          courseIds: courseIds,
      },
      withCredentials: true,
      url: `${REACT_APP_SERVER}/courses/handle-form-actions`
    })
    .then(ketqua => {
      document.getElementById("deleteAll-course-model").click()
      if(!ketqua.data) {
        alert(ketqua.data)
      }
      refreshCourse()
      refreshDeleteCourse()
    })
  }
  // Close modal xoa nhieu khoa hoc
  const closeModal = () => {
    document.getElementById("deleteAll-course-model").click() 
  }
  // Xoa 1 khoa hoc
  const deleteCourse = (courseID) => (e) => {
    e.preventDefault()
    axios({
      method: "delete",
      data: {},
      withCredentials: true,
      url: `${REACT_APP_SERVER}/courses/${courseID}`
    })
    .then(ketqua => {
      // console.log(typeof(ketqua.data), ketqua.data);
      if(!ketqua.data) {
        alert(ketqua.data)
      }
      refreshCourse()
      refreshDeleteCourse()
    })
  }

  // Them khoa hoc
  const handleNameCourse = (e) => {
    setNameCourse(e.target.value)
  }
  const handleDescription = (e) => {
    setDescription(e.target.value)
  }
  const handleLevel = (e) => {
    setLevel(e.target.value)
  }
  const handleReq = (e) => {
    setReq(e.target.value)
  }
  const handleResult = (e) => {
    setResult(e.target.value)
  }
  const addCourse = (e) => {
    $("#addCourse").submit(function(e){
        return false;
    });

    if (nameCourse !== '' && level !== '' && description !== '') {
        axios({
            method: "post",
            data: {
                name: nameCourse,
                description: description,
                level: level,
                req: req,
                result: result,
            },
            withCredentials: true,
            url: `${REACT_APP_SERVER}/courses/store`
        })
        .then(ketqua => {
          document.getElementById("addKH").click()
          if(ketqua.data !== true) {
            alert(ketqua.data)
          }
          refreshCourse()
          refreshDeleteCourse()
          setNameCourse('')
          setDescription('')
          setReq('')
          setResult('')
          setLevel('Beginner')
        })
    }
  }
  

  document.title = "Kh??a h???c c???a t??i"

  const sort = (num) => (e) => {
    let columnNew = column
    for(let index = 0; index < 5; index++) {
      if (index === num) continue
      else
        columnNew[index].icon = icons.current.default
        columnNew[index].type = "desc"
    }
    columnNew[num].type = types.current[columnNew[num].type]
    columnNew[num].icon = icons.current[columnNew[num].type]
    setColumn(columnNew)
  }

  const refreshCourse = (e) => {
    axios({
      method: "get",
      withCredentials: true,
      data: {},
      url: `${REACT_APP_SERVER+location.pathname+location.search}`
    })
    .then(ketqua => {
      let result = ketqua.data[0]
      setCourse(result)
    })
  }
  const refreshDeleteCourse = (e) => {
    axios({
      method: "get",
      withCredentials: true,
      data: {},
      url: `${REACT_APP_SERVER}/me/stored/deletedCount`
    })
    .then(ketqua => {
      setDeletedCount(ketqua.data);
    })
  } 

  useEffect(() => {
    refreshCourse()
  }, [location.search])

  useEffect(() => {
    refreshDeleteCourse()
  }, [])

  return (
    <div>
      <div className="container">
        <form name="container-form" method="POST" className="mt-4">
          <div>
            <h3><strong>Kh??a h???c c???a t??i</strong></h3>

            <div className="mt-4 mb-2 d-flex align-items-center">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" id="checkbox-all"/>
                <label className="form-check-label" htmlFor="checkbox-all" >
                  Ch???n t???t c???
                </label>
              </div>
              <select className="form-control form-control-sm checkbox-select-all-options" name="action" onChange={handleAction} required>
                <option value="">-- H??nh ?????ng --</option>
                <option value="delete">X??a</option>
              </select>
              <button className="btn btn-primary btn-sm check-all-submit-btn" id="check-all-submit-btn" disabled={boolean} onClick={handleCheckAllSubmitBtn}>Th???c hi???n</button>
              <a href="/#" className="btn btn-primary btn-sm ml-auto mr-2" data-toggle="modal" data-target="#addKH" title="Th??m kh??a h???c"><i className="fas fa-plus-circle"></i></a>
              <Link to="/me/trash/courses" className="btn btn-primary btn-sm" title="X??a kh??a h???c"><i className="fas fa-trash-alt"></i> {deletedCount}</Link>
            </div>
          </div>

          <table className="table">
              <thead>
                  <tr>
                      <th></th>
                      <th scope="col">STT</th>
                      <th scope="col">T??n kh??a h???c <Link to={`?_sort&column=name&type=${column[0].type}`} onClick={sort(0)}> <span className={column[0].icon}></span></Link></th>
                      <th scope="col">Mi??u t??? kh??a h???c <Link to={`?_sort&column=description&type=${column[1].type}`} onClick={sort(1)}> <span className={column[1].icon}></span></Link></th>
                      <th scope="col">Tr??nh ????? k??? n??ng <Link to={`?_sort&column=level&type=${column[2].type}`} onClick={sort(2)}> <span className={column[2].icon}></span></Link></th>
                      <th scope="col">Y??u c???u <Link to={`?_sort&column=req&type=${column[3].type}`} onClick={sort(3)}> <span className={column[3].icon}></span></Link></th>
                      <th scope="col">K???t qu??? ?????t ???????c<Link to={`?_sort&column=result&type=${column[4].type}`} onClick={sort(4)}> <span className={column[4].icon}></span></Link></th>
                      <th>C??ng c???</th>
                  </tr>
              </thead>
              {course.toString() ? course.map((course,index)=>(
                <tbody key={index}>
                    <tr title={`Ng??y t???o: ${moment(course.createdAt).format("L")} | Ng??y c???p nh???t: ${moment(course.updatedAt).format("L")}`}>
                        <td>
                          <div className="form-check">
                            <input className="form-check-input courseId" type="checkbox" name="courseIds[]" value={course._id}/>
                          </div>
                        </td>
                        <th scope="row">{index+1}</th>
                        <td>{course.name}</td>
                        <td>
                          <div className="mb-3">{
                              course.description.split('\n').map(
                                  (str,index) => <div key={index}>{str}</div>)
                          }</div>
                        </td>
                        <td>{course.level}</td>
                        <td>
                          <div className="mb-3">{
                            course.req.split('\n').map(
                            (str,index) => <div key={index}>{str}</div>)
                          }</div>
                        </td>
                        <td>
                          <div className="mb-3">{
                            course.result.split('\n').map(
                            (str,index) => <div key={index}>{str}</div>)
                          }</div>
                        </td>
                        <td style={{width: "200px"}}>
                            <a href={`/livestream/${course._id}`} className="btn-link" title="Livestream"><i className="fas fa-video" style={{color: "#1266F1"}}></i></a>
                            <Link to={`/me/stored/${course._id}/EditCourse`} className="btn-link" title="T??y ch???nh"><i className="fas fa-cog" style={{color: "#B23CFD"}}></i></Link>
                            <Link to="#" className="btn-link" onClick={deleteCourse(course._id)} title="X??a"><i className="fas fa-trash-alt" style={{color: "#ff0000"}}> </i></Link>
                        </td>
                    </tr>
                </tbody>
              ))
              :
              (
                <tbody><tr>
                      <td colSpan="7" className="text-center"> B???n ch??a ????ng kh??a h???c n??o!
                      </td>
                    </tr>
                </tbody>
              )
              }
          </table>
        </form>
      </div>

      <div id="deleteAll-course-model" className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">X??a kh??a h???c?</h5>
              <button type="button" className="close closeModal" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>B???n ch???c ch???n x??a c??c kh??a h???c ???? ch???n n??y?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary closeModal" data-dismiss="modal" onClick={closeModal}>H???y</button>
              <button id="btn-deleteall-course" type="button" className="btn btn-danger" onClick={handleAllCourse}>Th???c hi???n</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="addKH">
          <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">

              <div className="modal-header">
              <h4 className="modal-title">Th??m kh??a h???c:</h4>
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              </div>

              <form method="POST" action="/courses/store" id="addCourse">
                <div className="modal-body">
                    <table className="table table-striped">
                      <tbody>
                        <tr>
                            <td width="20px"><h5>T??n kh??a h???c:</h5></td>
                            <td>
                              <input type="text" className="form-control" id="name" name="name" required onChange={handleNameCourse} value={nameCourse}/>
                            </td>
                        </tr>
                        <tr>
                            <td><h5>Mi??u t??? kh??a h???c:</h5></td>
                            <td>
                              <textarea type="text" className="form-control" id="mieuta" name="mieuta" required onChange={handleDescription} value={description}></textarea>
                            </td>
                        </tr>                     
                        <tr>
                            <td width="20px"><h5>Tr??nh ????? k??? n??ng:</h5></td>
                            <td>
                              <select className="form-control" id="GT" name="gender" onChange={handleLevel} value={level}>
                                  <option value="Beginner">Beginner</option>
                                  <option value="Skilled">Skilled</option>
                                  <option value="Expert">Expert</option>
                              </select>                          
                            </td>
                        </tr>                     
                        <tr>
                            <td width="20px"><h5>Y??u c???u:</h5></td>
                            <td>
                              <textarea type="text" className="form-control" id="mieuta" name="mieuta" onChange={handleReq} value={req}></textarea>
                            </td>
                        </tr>
                        <tr>
                            <td width="20px"><h5>K???t qu??? ?????t ???????c:</h5></td>
                            <td>
                              <textarea type="text" className="form-control" id="mieuta" name="mieuta" onChange={handleResult} value={result}></textarea>
                            </td>
                        </tr>
                      </tbody>
                    </table>
                </div>   
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                    <button type="submit" className="btn btn-success" onClick={addCourse}>Th??m kh??a h???c</button>
                </div>
              </form>
          </div>
          </div>
      </div>
    </div>
  )
}

export default StoredCourses