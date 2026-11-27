import { useState } from 'react'

function Button({start = 0, increment = 1, children}) {
	let a = useState(start)

	//console.log(a)
	//console.trace()
	return (
		<>
		<buttton
          type="button"
          className="counter"
			onClick={() => a[1]((an) => an + increment)}
		>
			{children} {a[0]}
		</buttton>
		</>
	)
}

export default Button
