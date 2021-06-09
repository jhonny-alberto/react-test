import React, { useState, useCallback, useEffect } from 'react'
import millisec from "millisec"

import useInterval from '../../hooks/useInterval'
import "./index.css"

const leadZero = (val) => val < 10 ? "0" + val : "" + val

const Digit = props => {
  const { curValue, nextValue } = props
  const [animated, setAnimated] = useState(false)
  const [prevValue, setPrevValue] = useState(0)

  useEffect(() => {
    setAnimated(true)
    setPrevValue(curValue)
    setTimeout(() => {
      setAnimated(false)
    }, 150)
    return () => {
      setAnimated(false)
    }
  }, [curValue, setAnimated])

  return (
    <span
      className="digit"
    >
      <span className="hidden">{curValue}</span>
      <span className="current">{animated ? prevValue : curValue}</span>
      <span className="next">{animated ? curValue : nextValue}</span>
    </span>
  )
}

const Item = props => {
  const { curValue, nextValue, label } = props
  const [zeroValue, setZeroValue] = useState("")
  const [multipleLabel, setMultipleLabel] = useState('')

  useEffect(() => {
    setZeroValue(leadZero(nextValue))
    if (curValue === 0 || curValue > 1) setMultipleLabel(`${label}s`)
  }, [curValue, nextValue, label])

  return (
    <span className="item">
      <span className="digits">
        {zeroValue.split("").map((v, i) => (
          <Digit key={i} curValue={v} nextValue={zeroValue[i]} />
        ))}
      </span>
      <div className="label">{multipleLabel}</div>
    </span>
  )
}

const Countdown = props => {
  const { endTime } = props

  const [curValue, setCurValue] = useState(0)
  const [nextValue, setNextValue] = useState(0)
  const [isPlaying, setPlaying] = useState(true)

  const tick = useCallback(() => {
    const time = Date.now()

    let duration = +endTime - time

    if (duration <= 0) {
      duration = 0
      setPlaying(false)
    }

    setCurValue(millisec(duration))
    setNextValue(millisec(duration - 1000))
  }, [setPlaying, setCurValue, setNextValue, endTime])

  useInterval(
    () => {
      tick()
    },
    isPlaying ? 500 : null,
  )
  
  useEffect(() => {
    if (isNaN(endTime) || Date.now() > endTime) {
      setPlaying(false)
    }
  }, [endTime, setPlaying])

  //start/stop interval
  useEffect(() => {
    setPlaying(true)   
    return () => {
      setPlaying(false)
    }
  }, [setPlaying])

  return (
    curValue && (
      <div className="countdown">
        {curValue._days > 0 && (
          <Item
            curValue={curValue._days}
            nextValue={nextValue._days}
            label="day"
          />
        )}
        <Item
          curValue={curValue._hours}
          nextValue={nextValue._hours}
          label="hr"
        />
        <Item
          curValue={curValue._minutes}
          nextValue={nextValue._minutes}
          label="min"
        />
        <Item
          curValue={curValue._seconds}
          nextValue={nextValue._seconds}
          label="sec"
        />
      </div>
    )
  )
}
export default Countdown;