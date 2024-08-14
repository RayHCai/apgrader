import { useState } from 'react';
import { useNavigate } from 'react-router';

import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

import Button from '@/components/button';
import { BACKEND_URL } from '@/settings';

import classes from './styles.module.css';

export default function Home() {
    const navigate = useNavigate();

    const [isUpload, updateIsUpload] = useState(false);
    const [isStartup, updateIsStartup] = useState(true);

    const [slideOutAnimation, updateSlideOutAnimation] = useState(false);

    const [cardInd, updateCardInd] = useState(0);
    const [cardEnterAnim, updateCardEnterAnim] = useState(false);
    const [cardLeaveAnim, updateCardLeaveAnim] = useState(false);

    const [question, updateQuestion] = useState('');
    const [rubric, updateRubric] = useState('');

    async function upload() {
        if (!question || !rubric) return;

        const response = await fetch(`${BACKEND_URL}/assignments/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question,
                rubric,
            }),
        });

        if (!response.ok) return;

        const json = await response.json();

        navigate(`/grades?id=${json.assignment}`);
    }

    return (
        <div className={ classes.container }>
            <div
                className={ `${isStartup ? classes.startup : classes.hidden} ${
                    slideOutAnimation ? classes.slideOut : ''
                }` }
                onAnimationEnd={ () => updateIsStartup(false) }
            >
                <h1>apgrader</h1>

                <Button
                    onClick={ () => {
                        updateIsUpload(true);
                        updateSlideOutAnimation(true);
                    } }
                >
                    start grading
                </Button>
            </div>

            <div className={ `${isUpload ? classes.upload : classes.hidden}` }>
                <div className={ classes.cardContainer }>
                    { (function () {
                        const cards = [
                            <>
                                <h1>upload question</h1>

                                <textarea
                                    value={ question }
                                    onChange={ (e) =>
                                        updateQuestion(e.target.value)
                                    }
                                />
                            </>,
                            <>
                                <h1>upload rubric</h1>

                                <textarea
                                    value={ rubric }
                                    onChange={ (e) =>
                                        updateRubric(e.target.value)
                                    }
                                />
                            </>,
                        ];

                        return (
                            <div className={ classes.cardContent }>
                                { cardInd > 0 && (
                                    <IoIosArrowBack
                                        className={ classes.arrow }
                                        onClick={ () => {
                                            updateCardLeaveAnim(true);
                                            updateCardInd(cardInd - 1);
                                        } }
                                    />
                                ) }

                                <div
                                    className={ `${classes.card}
                                            ${
                                                cardEnterAnim &&
                                                classes.cardEnterAnim
                                            }
                                            ${
                                                cardLeaveAnim &&
                                                classes.cardLeaveAnim
                                            }` }
                                    onAnimationEnd={ () => {
                                        if (cardEnterAnim) {
                                            updateCardEnterAnim(false);
                                        }
 else if (cardLeaveAnim) {
                                            updateCardLeaveAnim(false);
                                        }
                                    } }
                                >
                                    { cards[cardInd] }
                                </div>

                                { cardInd < cards.length - 1 && (
                                    <IoIosArrowForward
                                        className={ classes.arrow }
                                        onClick={ () => {
                                            updateCardEnterAnim(true);
                                            updateCardInd(cardInd + 1);
                                        } }
                                    />
                                ) }

                                { cardInd === cards.length - 1 && (
                                    <Button isDark={ true } onClick={ upload }>
                                        upload
                                    </Button>
                                ) }
                            </div>
                        );
                    })() }
                </div>
            </div>
        </div>
    );
}
