
const handleSubmit=(e) => {
    e.preventDefault();
    console.log(user);
};


<div className="registration-form">
    <h1 className="main-heading mb-3">login form</h1>
    <br />

    <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="email">email</label>
            <input 
            type="email"
            name="email"
            placeholder="enter your email"
            id="email"
            required
            autoComplete="off"
            value={user.email}
            onChange={handleInput}
            />
        </div>

        <div>
            <label htmlFor="password">email</label>
            <input 
            type="password"
            name="password"
            placeholder="enter your password"
            id="password"
            required
            autoComplete="off"
            value={user.password}
            onChange={handleInput}
            />
        </div>

        <br />
        <button type="submit" className="btn btn-submit">
            Register Now
        </button>
    </form>
</div>