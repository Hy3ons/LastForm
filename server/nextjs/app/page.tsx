import MainInsertTable from './components/MainInsertTable/MainInsertTable';
import MainLineChart from './components/MainLineChart/MainLineChart';
import GetStart from './components/GetStart/GetStart';
import SvgTest from './components/SvgTest/SvgTest';

export default function Home() {
    return (
        <>
            <div className="page-wrapper">
                <div className="up-wrapper">
                    <GetStart />
                </div>
                <div className="down-wrapper">
                    <div className="left-wrapper">
                        <div className="chart-wrapper">
                            <MainLineChart userName={'hhs2003'} amount={15} />
                        </div>

                        <button className="service-button">
                            Service Check Button
                        </button>

                        <div>
                            <SvgTest username="hhs2003" limit={30} />
                        </div>
                    </div>
                    <div className="right-wrapper">
                        <div className="recentInfo-wrapper">
                            <MainInsertTable />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
