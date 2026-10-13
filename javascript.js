
let asrDate
let previousPrayerDate
const countdownElement = document.querySelector(".next-prayer h2")
const progressElement =document.querySelector(".countdown-progress")
async function getprayertime(){


    const response = await fetch("https://api.aladhan.com/v1/timingsByCity?city=Dublin&country=Ireland&method=3")
    if (!response.ok) {
    throw new Error("Failed to load prayer times")
}
    document.querySelector("#prayer-status").textContent = ""

    const data = await response.json()
    const prayerTime = data.data.timings
    const fajr = prayerTime.Fajr
    const Dhuhr = prayerTime.Dhuhr
    const asr = prayerTime.Asr
    const Maghrib = prayerTime.Maghrib
    const isha = prayerTime.Isha

    document.querySelectorAll(".prayer-time h3") [0].textContent = fajr
    document.querySelectorAll(".prayer-time h3") [1] .textContent = Dhuhr
    document.querySelectorAll(".prayer-time h3") [2].textContent = asr
    document.querySelectorAll(".prayer-time h3") [3] .textContent = Maghrib
    document.querySelectorAll(".prayer-time h3") [4] .textContent = isha

    const prayerNames = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]
    const prayerTimes = [fajr, Dhuhr, asr, Maghrib, isha]

    const currentTime = new Date()
    let nextPrayerIndex = -1
    for (let i = 0; i < prayerTimes.length; i++) {
    const timeParts = prayerTimes[i].split(":")
    const hour = Number(timeParts[0])
    const minute = Number(timeParts[1])

    const prayerDate = new Date()
    prayerDate.setHours(hour, minute, 0, 0)

    if (prayerDate > currentTime) {
    nextPrayerIndex = i
    asrDate = prayerDate
    previousPrayerDate = new Date(prayerDate)
    previousPrayerDate.setDate(previousPrayerDate.getDate() - 1)

   if (i > 0) {
    const previousParts = prayerTimes[i - 1].split(":")
    previousPrayerDate = new Date()
    previousPrayerDate.setHours(
        Number(previousParts[0]),
        Number(previousParts[1]),
        0,
        0
    )
}
    break
}
}


  if (nextPrayerIndex === -1){
    nextPrayerIndex = 0
    asrDate = new Date()
    asrDate.setDate(asrDate.getDate() + 1)

    const timeParts = prayerTimes[0].split(":")
    asrDate.setHours(
        Number(timeParts[0]),
        Number(timeParts[1]),
        0,
        0
    )

    const previousParts = prayerTimes[4].split(":")
    previousPrayerDate = new Date()
    previousPrayerDate.setHours(
        Number(previousParts[0]),
        Number(previousParts[1]),
        0,
        0
    )
}

   const nextPrayerElement = document.querySelector(".next-prayer p")
   nextPrayerElement.textContent = "Next Prayer: " + prayerNames[nextPrayerIndex]

}

function updateCountdown(){

    const currentTime = new Date()
    const timeDifference = asrDate - currentTime
    const totalPrayerTime = asrDate - previousPrayerDate
    const elapsedTime = currentTime - previousPrayerDate
    const progressPercentage = (elapsedTime / totalPrayerTime) * 100
    progressElement.style.width = progressPercentage + "%"

    const totalSeconds = timeDifference / 1000
    const totalMinutes = totalSeconds / 60
    const totalHours = totalMinutes / 60
    const hours = Math.floor(totalHours)
    const remainingMinutes = totalMinutes - (hours * 60)
    const minutes = Math.floor(remainingMinutes)
    const remainingSeconds = totalSeconds - (Math.floor(totalMinutes) * 60)
    const seconds = Math.floor(remainingSeconds)
    const hoursString = String(hours)
    const displayHours = hoursString.padStart(2, "0")
    const minutesString = String(minutes)
    const displayMinutes = minutesString.padStart(2, "0")
    const secondsString = String(seconds)
    const displaySeconds = secondsString.padStart(2, "0")
    const countdownText = displayHours + ":" + displayMinutes + ":" + displaySeconds
    countdownElement.textContent = countdownText

}
    getprayertime()

    setInterval(updateCountdown, 1000)
