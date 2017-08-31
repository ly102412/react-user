import React,{Component,PropTypes} from "react";
import axios from "axios"
export default class Main extends Component {

  static propTypes = {
    searchName: PropTypes.string.isRequired
  }

  state = {
    firstView:true,
    loading:false,
    users:null,
    errorMsg:null
  };

  componentWillReceiveProps(nextProps){
    const searchname = nextProps.searchName;
    console.log("componentWillReceiveProps"+searchname);

    this.setState({
      firstView:false,
      loading:true
    });

    const url = `https://api.github.com/search/users?q=${searchname}`
    axios.get(url)
      .then(response => {
        const result = response.data;
        const users = result.items.map(item => {
          return {
            user_url: item.html_url,
            avatar_url: item.avatar_url,
            username: item.login
          }
        })
        this.setState({
          loading: false,
          users
        });
      })
      .catch (error => {
        this.setState({
          loading: false,
          errorMsg: '请求失败!'
        })
      })
  }

  render () {

    const {firstView,loading,users,errorMsg} =  this.state;

    if(firstView){
      return <h2>Enter name to search:{this.props.searchName}</h2>;
    }else if (loading){
      return <h2>Loading……</h2>;
    }else if (errorMsg) {
      return <h2>{errorMsg}</h2>;
    }else {
      return (
        <div className="row">
          {
            users.map((user, index) => (
              <div key={index} className="card">
                <a href={user.user_url} target="_blank">
                  <img src={user.avatar_url} style={{width: '100px'}}/>
                </a>
                <p className="card-text">{user.username}</p>
              </div>
            ))
          }
        </div>

      );
    };
  };
};