import { useDispatch, useSelector } from "react-redux"
import { closeRulesModal } from "../../store/slices/modalSlice/modalSlice"

const MatchRulesModal = () => {
  const isModalOpen = useSelector(state => state.modal.rulesModal)
  const dispatch = useDispatch()

  const handleClose = ()=> {
    dispatch(closeRulesModal())
  }
  return (
    <>
      <div onClick={handleClose} className={`h-dvh w-full fixed z-[500] top-0 left-0 items-center justify-center bg-black/40 transition-all duration-500 ease-in-out ${isModalOpen ? 'flex' : 'hidden'}`} style={{backdropFilter: 'blur(4px)'}}>
        <div className="w-full md:mt-0 sm:max-w-lg xl:p-0 relative z-10 mx-3 h-[95dvh] overflow-hidden flex items-center">
          <div onClick={(e)=> {e.stopPropagation()}} className="max-h-full w-full overflow-hidden flex flex-col bg-white rounded-lg shadow dark:border">
            <div className="modal-header flex-shrink-0 flex px-4 py-3 items-center justify-between border-b border-gray-200">
              <div className="title text-lg font-semibold">Rules</div>
              <button onClick={handleClose}>
                <img className="h-3 object-contain" src="assets/img/closeIcon.png" alt="" />
              </button>
            </div>
            <div className="modal-body flex-1 overflow-y-auto p-4 text-sm flex flex-col [&_p]:mb-3 [&_ul]:mb-3 [&_br]:mb-3 [&_h3]:w-full [&_h3]:bg-gray-200 [&_h3]:text-center [&_h3]:my-4 [&_h3]:py-2">
                <p>1.&nbsp;Cricket General :- If a ball is not bowled during a competition, series or match then all bets will be void except for those on any market that has been unconditionally determined (e.g. in the 'Completed Match' market).</p>
                <p>2.&nbsp;Cricket General :- If a match is shortened by weather, all bets will be settled according to the official result (including for limited overs matches, the result determined by the Duckworth Lewis method).</p>
                <p>3.&nbsp;Cricket General :- In the event of a match being decided by a bowl-off or toss of the coin, all bets will be void except for those on markets that have been unconditionally determined.</p>
                <p>4.&nbsp;Cricket Test matches :- If a match starts but is later abandoned for any reason other than weather (which may include but is not limited to: dangerous or unplayable wicket or outfield; pitch vandalism; strike or boycott; crowd protests/violence; stadium damage; acts of terrorism; and acts of God), Betfair reserves the right to void all bets, except for those on markets that have been unconditionally determined.</p>
                <p>5.&nbsp;In case anyone is found using 2 different IDs and logging in from same IP his winning in both accounts will be cancelled.</p>
                <p>6.&nbsp;Cricket Test matches :- If the match is not scheduled to be completed within five days after the original scheduled completion date, then all bets on markets for this event will be void, except for bets on any markets that have been unconditionally determined.</p>
                <p>7.&nbsp;Cricket Limited Over matches :- If a match is declared No Result, bets will be void on all markets for the event except for those markets which have been unconditionally determined or where the minimum number of overs have been bowled as laid out in the market specific information.</p>
                <p>8.&nbsp;Cricket Limited Over matches :- In the event of a new toss taking place on a scheduled reserve day for a limited overs match all bets that were placed after 30 minutes before the original scheduled start of play on the first day will be made void. This rule relates to all markets except those that have been unconditionally determined (e.g. in the win the toss and toss combination markets).</p>
                <p>9.&nbsp;In Case of Rain or If Over Gets Reduced then this Market Will get Voided Incomplete Session Bet will be Cancelled but Complete Session Will be Settled Criteria :- We will Only Count Last Digit of Sessions Total while settling ..For Example if in 6 Overs Market the Score is 43 ...so we will Settle the Market for 6 Over Lottery @ 3</p>
                <p>10.&nbsp;Multiple Bets :- Multiple Bets With Same Time And Same User Will Be Voided Immediately.</p>
                <div >
                  <div >
                    <h3 >Cricket Bookmaker</h3>
                  </div>
                  <div >&nbsp;</div>
                  <div >
                    <p >1. Due to any reason any team will be getting advantage or disadvantage we are not concerned.</p>
                  </div>
                  <div >
                    <p >2. We will simply compare both teams 25 overs score higher score team will be declared winner in ODI (25 over comparison)</p>
                  </div>
                  <div >
                    <p >3. We will simply compare both teams 10 overs higher score team will be declared winner in T20 matches (10 over comparison)</p>
                  </div>
                  <div >
                    <p >4. Any query about the result or rates should be contacted within 7 days of the specific event, the same will not be considered valid post 7 days from the event.</p>
                  </div>
                  <div  className="rules-content"><div ><div ><div >
                    <h3 ><strong >Rules Of Fancy Bets</strong></h3>
                    </div></div>
                    <div ><div >
                      <p >1. Once all session/fancy bets are completed and settled there will be no reversal even if the Match is Tied or is Abandoned.</p>
                      </div></div><div ><div ><div ><div >
                        <p >2. Advance Session or Player Runs and all Fancy Bets are only valid for 20/50 overs full match each side. (Please Note this condition is applied only in case of Advance Fancy Bets only).</p>
                        </div></div></div></div><div ><div ><div ><div >
                          <p >3. All advance fancy bets market will be suspended 60 mins prior to match and will be settled.</p>
                          </div></div></div></div><div ><div >
                            <p >4. Under the rules of Session/Fancy Bets if a market gets Suspended for any reason whatsoever and does not resume then all previous Bets will remain Valid and become HAAR/JEET bets.</p>
                            <p >5. Incomplete Session Bet will be cancelled but Complete Session will be settled.</p>
                            <p >6.&nbsp;In the case of Running Match getting Cancelled/ No Result/ Abandoned but the session is complete it will still be settled. Player runs / fall of wicket / Only Over will be also settled at the figures where match gets stopped due to rain for the inning (D/L) , cancelled , abandoned , no result.</p>
                            <p >7. If a player gets Retired Hurt and one ball is completed after you place your bets then all the betting till then is and will remain valid.</p>
                            <p >8.&nbsp;Should a Technical Glitch in Software occur, we will not be held responsible for any losses.</p>
                            <p >9.&nbsp;Should there be a power failure or a problem with the Internet connection at our end and session/fancy market does not get suspended then our decision on the outcome is final.</p>
                            <p >10. All decisions relating to settlement of wrong market being offered will be taken by management. Management will consider all actual facts and decision taken will be full in final.</p>
                            <p >11.Any bets which are deemed of being suspicious, including bets which have been placed from the stadium or from a source at the stadium maybe voided at anytime. The decision of whether to void the particular bet in question or to void the entire market will remain at the discretion of Company. The final decision of whether bets are suspicious will be taken by Company and that decision will be full and final.</p>
                            <p >12.&nbsp;Any sort of cheating bet , any sort of Matching (Passing of funds), Court Siding (Ghaobaazi on commentary), Sharpening, Commission making is not allowed in Company, If any company User is caught in any of such act then all the funds belonging that account would be seized and confiscated. No argument or claim in that context would be entertained and the decision made by company management will stand as final authority.</p>
                            <p >13.&nbsp;Fluke hunting/Seeking is prohibited in Company , All the fluke bets will be reversed. Cricket commentary is just an additional feature and facility for company user but company is not responsible for any delay or mistake in commentary.</p>
                            <p >14. In case anyone is found using 2 different IDs and logging in from same IP his winning in both accounts will be cancelled.</p> 
                            15.&nbsp;If any case wrong rate has been given in fancy ,that particular bets will be cancelled (Wrong Commentary). 
                            <p >&nbsp;</p>
                            <p >16.&nbsp;In case customer make bets in wrong fancy we are not liable to delete, no changes will be made and bets will be considered as confirm bet.</p>
                            <p >17.&nbsp;Dot Ball Market Rules</p>
                            <ul >
                              <li >Wides Ball - Not Count</li>
                              <li >No Ball - Not Count</li>
                              <li >Leg Bye - Not Count as A Dot Ball</li>
                              <li >Bye Run - Not Count as A Dot Ball</li>
                              <li >Out - Any Type of WKT Not Count as A Dot Ball</li>
                            </ul>
                            <p >18.&nbsp;Penalty Runs - Any Penalty Runs in the Match Will be Counted While Settling in our Exchange.</p>
                            <p >19. All Test In Future Also ...All Full Match Markets Me Minimum 300 Overs Play Or Match Result Needed Otherwise All Full Match Fancy Voided</p>
                            <p >20. If match stoped by any reason running over in the match will count as complete over in Single over market(only overs runs) . Atleast one ball to be bowled needed in the over</p>
                            <p >21. In Test/Odi/T20 partnership If one batsman Will injured Then partnership Will continued With next batsman.</p>
                            <div ><div >
                              <h3 ><strong >Rules Of Line Market</strong></h3>
                              </div></div><div ><div >
                                <p >1.How many runs will be scored in the stated number of overs? Line market: This market operate with a bet delay of 1 second; All bets are struck at 2.0 The 'price' at which your bet is placed defines the number of runs bet upon. *YES Line* (buy) bets win when more runs are scored in the specified number of overs than the 'price' at which the bet is matched. *NO Line* (Sell) bets win when fewer runs are scored in the specified number of overs than the 'price' at which the bet is matched. This market will be settled if 5 overs have been completed in the innings, the batting team is bowled out or has reached the target to win the match.</p>
                                <p >2. How many runs will be scored in the stated number of overs? Line market:This market operate with a bet delay of 1 second; All bets are struck at 2.0 . The 'price' at which your bet is placed defines the number of runs bet upon. *YES Line* (Buy) bets win when more runs are scored in the specified number of overs than the 'price' at which the bet is matched. *NO Line* (Sell) bets win when fewer runs are scored in the specified number of overs than the 'price' at which the bet is matched. Special rules for Overs Runs Line markets: Bets will be void - regardless of whether the outcome of the bet is already unconditionally determined - when any of the following are the case: -if the scheduled number of overs for the innings is reduced by rain interruption and, at settlement time, the actual number of overs bowled is less than the number of overs stipulated at the head of these rules. - if the scheduled number of overs for the innings is reduced for any other reason after the innings has begun and at settlement time, that new number of scheduled overs is less than the number of overs stipulated at the head of these rules. Please note if the batting side reach their target within the 20 overs or have been bowled out and the innings hasn’t been reduced in overs to less than the stipulated number at the head of the rules, the market will be settled.</p>
                                <div ><div >
                                  <h3 ><strong >Rules Of PSL 2022 Full Series Fancy</strong></h3>
                                  </div></div><div ><div >
                                    <p >Total 34 Match Counted Start To Finals All Counted</p>
                                    <p >(1) Agar Koi Bhi Match Rain Ke Wajah Se Ya Power Fail Se Total 40 Overs Se Kam Khela Gaya To Fix Fancy Jo Hum Ne Tay Ki Hai Wo Add Kar Di Jayegi - 38.5 Over Counted As Under 40 Overs Match 39.1 Counted as Full 40 Over Match.</p>
                                    <p >(2) Bina Rain Ke Under 40 Overs Result Aata Hai To Scoreboard Ke Hisaab Se All Fancy Update Ki Jayegi.</p>
                                    <p >(3) By Chance Covid Ya Kisi Bhi Act Of God Reason Se Tournament Under 25 Match Intrupted Ho Jaata Hai To All Series Fancy Voided Plus Ho Or Minus.</p>
                                    <p >(4) Jo Fancy Ka Result Aa Gaya Jo Settle Ho Gyee Wo Void Nahi Hogi Wo Valid Hai.</p>
                                    <p >Over 25 Match All Fancy Settled <br />Non Playing Match Me Fix All Fancy Added</p>
                                    <p >Please Read All Fix Fancy Before Play<br />( All Fix Fancy Added In Full Washout Or Under 39.1 Overs Played Rain Affected Match )</p>
                                    <p >C And B Also Count In Series Catch Outs</p>
                                    <p >12 Wickets Per Match Added<br />27 Fours Per Match Added<br />11 Sixes Per Match Added<br />2 Fifty Per Match Added<br />8 Wides Per Match Added<br />14 Extras Per Match Added<br />8 Catch Per Match Added<br />2 Bowled Per Match Added<br />1 LBW Per Match Added<br />1 Runout Per match Added</p>
                                    <div ><div >
                                      <h3 ><strong >IPL 2022 Series Fancy Rules</strong></h3>
                                      </div></div><div ><div >
                                        <p >Total 74 Match Counted Start To Finals All Counted</p>
                                        <p >(1) Agar Koi Bhi Match Rain Ke Wajah Se Ya Power Fail Se Total 40 Overs Se Kam Khela Gaya To Fix Fancy Jo Hum Ne Tay Ki Hai Wo Add Kar Di Jayegi - 38.5 Over Counted As Under 40 Overs Match 39.1 Counted as Full 40 Over Match.</p>
                                        <p >(2) Bina Rain Ke Under 40 Overs Result Aata Hai To Scoreboard Ke Hisaab Se All Fancy Update Ki Jayegi.</p>
                                        <p >(3) By Chance Covid Ya Kisi Bhi Act Of God Reason Se Tournament Under 40 Match Intrupted Ho Jaata Hai Aur 30 Day Re Start Nahi Hota Hai To All Series Fancy Voided Plus Ho Or Minus.</p>
                                        <p >(4) Jo Fancy Ka Result Aa Gaya Jo Settle Ho Gyee Wo Void Nahi Hogi Wo Valid Hai.</p>
                                        <p >Over 50 Match All Fancy Settled <br />Non Playing Match Me Fix All Fancy Added</p>
                                        <p >Please Read All Fix Fancy Before Play<br />( All Fix Fancy Added In Full Washout Or Under 39.1 Overs Played Rain Affected Match )</p>
                                        <p >C And B Also Count In Series Catch Outs</p><p >12 Wickets Per Match Added<br />28 Fours Per Match Added<br />12 Sixes Per Match Added<br />2 Fifty Per Match Added<br />8 Wides Per Match Added<br />16 Extras Per Match Added<br />8 Catch Per Match Added<br />2 Bowled Per Match Added<br />1 LBW Per Match Added<br />1 Runout Per match Added<br />1 No Ball Per Match Added<br />1 Duck Per Match Added</p><p >Fab Four vs Poor Sixes Bookmaker Rules</p>
                                        <p >70 Match Counted <br />In This Market <br />4 Team Set Vs 6 Team Set</p>
                                        <p >You Bet On Which Group Wins More Matches</p>
                                        <p >Example If Fab Four Teams Win 34 match And poor Six wins 37 match means poor six win Market</p>
                                        <p >If Both Group Win Same Matches Than Table Top Teams Group Win Market</p>
                                        </div></div><div ><div >
                                          <h3 ><strong >TEST Match Rules</strong></h3>
                                          </div></div><p >1. All Test In Future Also ...Minimum 300 overs has been played or the match has been won by any team otherwise all these fancy will be deleted</p><p >2.1st innig Adv Runs is not completed for example: If You are Placing Advance Bets in 1st innigs 80 over runs ADV in case team-A declares or all-out at 70 over next 10 over counted in Team-B's 1st inning.</p><p >3. Test match both advance fancy batsman run, Fall Of Wkt Runs, is valid on both team's 1st innings.</p><p >4.In case due to weather situation match has been stopped all lambi trades will be deleted.</p></div></div></div></div></div></div></div></div></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MatchRulesModal