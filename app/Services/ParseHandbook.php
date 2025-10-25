<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\CostArticle;
use App\Models\CostReflectionStatus;
use App\Models\CostType;
use App\Models\Evaluation;
use App\Models\Indicator;
use App\Models\PaymentType;
use App\Models\Pipeline;
use App\Models\Probability;
use App\Models\Project;
use App\Models\RevenueAccrualStatus;
use App\Models\Segment;
use App\Models\Service;
use App\Models\ServiceGroup;
use App\Models\Stage;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use OpenSpout\Reader\XLSX\Reader;

use function Adminer\idx;

class ParseHandbook
{
    public function parse(string $path)
    {
        $reader = new Reader();
        $reader->open($path);
        $models = [
            Service::class,
            ServiceGroup::class,
            PaymentType::class,
            Segment::class,
            Evaluation::class,
            Indicator::class,
            Stage::class,
            Probability::class,
            CostArticle::class,
            CostType::class,
            RevenueAccrualStatus::class,
            CostReflectionStatus::class,
        ];

        $pipeline = Pipeline::firstOrCreate(['name' => 'Ростелеком'], ['name' => 'Ростелеком']);

        foreach ($reader->getSheetIterator() as $sheet) {
            if ($sheet->getName() === "Справочники") {
                foreach ($sheet->getRowIterator() as $idx => $row) {
                    $cells = $row->getCells();
                    if ($idx === 1) {
                        continue;
                    }
                    // ServiceGroup
                    $serviceGroupName = $cells[1]->getValue();
                    $serviceGroup = null;
                    if ($serviceGroupName) {
                        $serviceGroup = ServiceGroup::firstOrCreate(
                            ['name' => $serviceGroupName],
                            ['name' => $serviceGroupName]
                        );
                    }

                    // Service (использует service_group_id)
                    $serviceName = $cells[0]->getValue();
                    if ($serviceName) {
                        Service::firstOrCreate(
                            ['name' => $serviceName],
                            ['name' => $serviceName, 'service_group_id' => $serviceGroup?->id]
                        );
                    }

                    // Остальные модели
                    $paymentTypeName = $cells[2]->getValue();
                    if ($paymentTypeName) {
                        PaymentType::firstOrCreate(['name' => $paymentTypeName], ['name' => $paymentTypeName]);
                    }

                    $segmentName = $cells[3]->getValue();
                    if ($segmentName) {
                        Segment::firstOrCreate(['name' => $segmentName], ['name' => $segmentName]);
                    }

                    $evaluationName = $cells[4]->getValue();
                    if ($evaluationName) {
                        Evaluation::firstOrCreate(['name' => $evaluationName], ['name' => $evaluationName]);
                    }

                    $indicatorName = $cells[5]->getValue();
                    if ($indicatorName) {
                        Indicator::firstOrCreate(['name' => $indicatorName], ['name' => $indicatorName]);
                    }

                    // Stage (особый случай)
                    $stageName = $cells[6]->getValue();
                    if ($stageName) {
                        Stage::firstOrCreate(
                            ['name' => $stageName],
                            ['name' => $stageName, 
                            'pipeline_id' => $pipeline->id, 
                            'probability' => $cells[7]->getValue() ?? 0.0,
                            'order' => $idx,
                            ]
                        );
                    }

                    $costArticleName = $cells[8]->getValue();
                    if ($costArticleName) {
                        CostArticle::firstOrCreate(['name' => $costArticleName], ['name' => $costArticleName]);
                    }

                    $costTypeName = $cells[9]->getValue();
                    if ($costTypeName) {
                        CostType::firstOrCreate(['name' => $costTypeName], ['name' => $costTypeName]);
                    }

                    $revenueAccrualStatusName = $cells[10]->getValue();
                    if ($revenueAccrualStatusName) {
                        RevenueAccrualStatus::firstOrCreate(['name' => $revenueAccrualStatusName], ['name' => $revenueAccrualStatusName]);
                    }

                    $costReflectionStatusName = $cells[11]->getValue();
                    if ($costReflectionStatusName) {
                        CostReflectionStatus::firstOrCreate(['name' => $costReflectionStatusName], ['name' => $costReflectionStatusName]);
                    }
                }
            } else {
                foreach ($sheet->getRowIterator() as $idx => $row) {
                    if ($idx <= 4) {
                        continue; // skip header
                    }
                    $cells = $row->getCells();
                    // Проверка ключевых полей
                    $requiredIndexes = array_merge(range(0, 8), []);
                    $skip = false;
                    foreach ($requiredIndexes as $i) {
                        if (empty($cells[$i]->getValue())) {
                            $skip = true;
                            break;
                        }
                    }
                    if ($skip) continue; // пропускаем строку
                    // dd(array_map(fn($e) => $e->getValue(), $cells), count($cells));
                    $serviceGroup = ServiceGroup::firstOrCreate(['name' => $cells[9]->getValue()], ['name' => $cells[9]->getValue()])->id;

                    $project = Project::create([
                        'date' => $cells[0]->getValue(),
                        'inn' => $cells[1]->getValue(),
                        'name' => $cells[3]->getValue(),
                        'client' => $cells[2]->getValue(),
                        'description' => $cells[3]->getValue(),
                        'stage_id' => Stage::firstOrCreate(['name' => $cells[4]->getValue()], ['name' => $cells[4]->getValue(), 'pipeline_id' => $pipeline->id,  'probability' => $cells[29]->getValue() ?? '',])->id,
                        'service_id' => Service::firstOrCreate(['name' => $cells[5]->getValue(),  'service_group_id' => $serviceGroup], ['name' => $cells[5]->getValue(), 'service_group_id' => $serviceGroup])->id,
                        'payment_type_id' => PaymentType::firstOrCreate(['name' => $cells[6]->getValue()], ['name' => $cells[6]->getValue()])->id,
                        'manager_id' => User::firstOrCreate(['last_name' => $cells[7]->getValue()], [
                            'last_name' => $cells[7]->getValue(), 
                            'name' => '', 
                            'email' => fake()->email, 
                            'password' => Hash::make('password'),
                            'role' => UserRole::USER->value,
                            ])->id,
                        'segment_id' => Segment::firstOrCreate(['name' => $cells[8]->getValue()], ['name' => $cells[8]->getValue()])->id,
                        // 
                        'eval_id' => Evaluation::firstOrCreate(['name'=> $cells[11]->getValue()], ['name'=> $cells[11]->getValue()])->id,
                        'is_industry_solution' => $cells[12]->getValue() === 'да' ? true : false,
                        'project_number' => $cells[30]->getValue() ?? '',
                        'stage_changed_at' => $cells[0]->getValue(),
                    ]);
                    // idx 10 .. 
                    $months = [
                        'january' => ['value' => $cells[13]->getValue() !== "" ? $cells[13]->getValue() :  0, 'status' => null, 'cost' => 0],
                        'february' => ['value' => $cells[14]->getValue() !== "" ? $cells[14]->getValue() :  0, 'status' => null, 'cost' => 0],
                        'march' => ['value' => $cells[15]->getValue() !== "" ? $cells[15]->getValue() :  0, 'status' => null, 'cost' => 0],
                        'april' => ['value' => $cells[16]->getValue() !== "" ? $cells[16]->getValue() :  0, 'status' => null, 'cost' => 0],
                        'may' => ['value' => $cells[17]->getValue() !== "" ? $cells[17]->getValue() :  0, 'status' => null, 'cost' => 0],
                        'june' => ['value' => $cells[18]->getValue() !== "" ? $cells[18]->getValue() :  0, 'status' => null, 'cost' => 0],
                        'july' => ['value' => $cells[19]->getValue() !== "" ? $cells[19]->getValue() :  0, 'status' => null, 'cost' => 0],
                        'august' => ['value' => $cells[20]->getValue() !== "" ? $cells[20]->getValue() :  0, 'status' => null, 'cost' => 0],
                        'september' => ['value' => $cells[21]->getValue() !== "" ? $cells[21]->getValue() :  0, 'status' => null, 'cost' => 0],
                        'october' => ['value' => $cells[22]->getValue() !== "" ? $cells[22]->getValue() :  0, 'status' => null, 'cost' => 0],
                        'november' => ['value' => $cells[23]->getValue() !== "" ? $cells[23]->getValue() :  0, 'status' => null, 'cost' => 0],
                        'december' => ['value' => $cells[24]->getValue() !== "" ? $cells[24]->getValue() :  0, 'status' => null, 'cost' => 0],
                    ];

                    $dateSeries = $project->dateSeries()->create([
                        'project_id' => $project->id,
                        'year' => $cells[10]->getValue(),
                        ...$months,
                        'total' => array_sum(array_map(fn($e) => (int)$e, array_column($months, 'value'))),
                    ]);
                }
            }
        }
    }
}
